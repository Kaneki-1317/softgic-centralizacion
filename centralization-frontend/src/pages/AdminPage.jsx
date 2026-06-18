import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FileText,
} from "lucide-react";

import MetricCard from "../components/Admin/MetricCard";
import AdminCaseCard from "../components/Admin/AdminCaseCard";
import CaseFormModal from "../components/Admin/CaseFormModal";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

export default function AdminPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [cases, setCases] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [metadata, setMetadata] = useState({
    tiposCasos: [],
    tecnologias: [],
    categorias: [],
    laboratorios: [],
  });

  useEffect(() => {
    loadCases();
    loadMetadata();
  }, []);

  async function loadCases() {
    try {
      const response = await api.get("/casos", { params: { size: 1000 } });
      setCases(response.data.content);
    } catch (error) {
      console.error(error);
      showToast("Error al cargar los casos", "error");
    }
  }

  async function loadMetadata() {
    try {
      const [tipos, tecs, cats, labs] = await Promise.all([
        api.get("/tipos-casos"),
        api.get("/tecnologias"),
        api.get("/categorias"),
        api.get("/laboratorios"),
      ]);
      setMetadata({
        tiposCasos: tipos.data,
        tecnologias: tecs.data,
        categorias: cats.data,
        laboratorios: labs.data,
      });
    } catch (error) {
      console.error(error);
      showToast("Error al cargar la metadata", "error");
    }
  }

  async function saveCase(data) {
    const isEditing = !!editingCase;
    try {
      if (isEditing) {
        await api.put(`/casos/${editingCase.id}`, data);
        showToast("Caso actualizado correctamente", "success");
      } else {
        await api.post("/casos", data);
        showToast("Caso creado correctamente", "success");
      }

      setOpenModal(false);
      setEditingCase(null);
      loadCases();
    } catch (error) {
      console.error(error);
      showToast(
        isEditing ? "Error al actualizar el caso" : "Error al crear el caso",
        "error"
      );
    }
  }

  async function deleteCase(id) {
    const confirmDelete = window.confirm("¿Eliminar este caso?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/casos/${id}`);
      showToast("Caso eliminado correctamente", "success");
      loadCases();
    } catch (error) {
      console.error(error);
      showToast("Error al eliminar el caso", "error");
    }
  }

  function editCase(item) {
    setEditingCase(item);
    setOpenModal(true);
  }

  function handleLogout() {
    showToast("Sesión cerrada correctamente", "success");
    logout();
    navigate("/login");
  }

  return (
    <main className="admin-page">

      <div className="page-header">
        <h1>Dashboard Admin</h1>
        <div className="header-actions">
          <button
            className="primary-button"
            onClick={() => {
              setEditingCase(null);
              setOpenModal(true);
            }}
          >
            Nuevo Caso
          </button>
          <button
            className="ghost-button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard
          title="Total Casos"
          value={cases.length}
          icon={<FileText />}
        />
      </div>

      <div className="admin-cases-grid">
        {cases.map((item) => (
          <AdminCaseCard
            key={item.id}
            item={item}
            onEdit={editCase}
            onDelete={deleteCase}
          />
        ))}
      </div>

      <CaseFormModal
        open={openModal}
        initialData={editingCase}
        onClose={() => {
          setOpenModal(false);
          setEditingCase(null);
        }}
        onSave={saveCase}
        tiposCasos={metadata.tiposCasos}
        tecnologias={metadata.tecnologias}
        categorias={metadata.categorias}
        laboratorios={metadata.laboratorios}
      />

    </main>
  );
}
