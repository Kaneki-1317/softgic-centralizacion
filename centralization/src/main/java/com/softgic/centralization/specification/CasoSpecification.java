package com.softgic.centralization.specification;

import com.softgic.centralization.model.Caso;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CasoSpecification {

    public static Specification<Caso> withFilters(
            String search, String tipo, String tecnologia, String categoria, String laboratorio) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String like = "%" + search.toLowerCase() + "%";

                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("titulo")), like),
                        cb.like(cb.lower(root.get("reto")), like),
                        existsRelatedMatch(cb, query, root, "tecnologias", "nombreTecnologia", like),
                        existsRelatedMatch(cb, query, root, "categorias", "nombreCategoria", like),
                        existsRelatedMatch(cb, query, root, "laboratorios", "nombreLaboratorio", like)
                ));
            }
            if (tipo != null && !tipo.isBlank()) {
                predicates.add(cb.equal(root.get("tipoCaso").get("nombreTipo"), tipo));
            }
            if (tecnologia != null && !tecnologia.isBlank()) {
                var join = root.join("tecnologias", JoinType.INNER);
                predicates.add(cb.equal(join.get("nombreTecnologia"), tecnologia));
            }
            if (categoria != null && !categoria.isBlank()) {
                var join = root.join("categorias", JoinType.INNER);
                predicates.add(cb.equal(join.get("nombreCategoria"), categoria));
            }
            if (laboratorio != null && !laboratorio.isBlank()) {
                var join = root.join("laboratorios", JoinType.INNER);
                predicates.add(cb.equal(join.get("nombreLaboratorio"), laboratorio));
            }

            // Distinct solo en la query principal, no en el count
            if (!Long.class.equals(query.getResultType())) {
                query.distinct(true);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    // Las 3 llamadas de arriba armaban una subconsulta EXISTS idéntica salvo
    // la relación y el campo — mismo SQL generado (misma subconsulta
    // correlacionada por id, mismo LIKE), solo se elimina la duplicación.
    // EXISTS se mantiene deliberadamente en vez de un LEFT JOIN + distinct:
    // con 3 relaciones many-to-many combinadas, un LEFT JOIN triple puede
    // multiplicar las filas por caso (producto cartesiano) antes de
    // deduplicar, mientras que EXISTS no fanea filas — es la opción más
    // eficiente para "¿existe al menos una coincidencia?".
    private static Predicate existsRelatedMatch(
            CriteriaBuilder cb, CriteriaQuery<?> query, Root<Caso> root,
            String relation, String field, String like) {
        Subquery<Long> sub = query.subquery(Long.class);
        var subRoot = sub.from(Caso.class);
        var join = subRoot.join(relation);
        sub.select(subRoot.get("id"))
                .where(cb.equal(subRoot.get("id"), root.get("id")),
                       cb.like(cb.lower(join.get(field)), like));
        return cb.exists(sub);
    }
}
