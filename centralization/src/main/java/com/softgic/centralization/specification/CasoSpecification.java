package com.softgic.centralization.specification;

import com.softgic.centralization.model.Caso;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
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

                Subquery<Long> techSub = query.subquery(Long.class);
                var techRoot = techSub.from(Caso.class);
                var techJoin = techRoot.join("tecnologias");
                techSub.select(techRoot.get("id"))
                        .where(cb.equal(techRoot.get("id"), root.get("id")),
                               cb.like(cb.lower(techJoin.get("nombreTecnologia")), like));

                Subquery<Long> catSub = query.subquery(Long.class);
                var catRoot = catSub.from(Caso.class);
                var catJoin = catRoot.join("categorias");
                catSub.select(catRoot.get("id"))
                        .where(cb.equal(catRoot.get("id"), root.get("id")),
                               cb.like(cb.lower(catJoin.get("nombreCategoria")), like));

                Subquery<Long> labSub = query.subquery(Long.class);
                var labRoot = labSub.from(Caso.class);
                var labJoin = labRoot.join("laboratorios");
                labSub.select(labRoot.get("id"))
                        .where(cb.equal(labRoot.get("id"), root.get("id")),
                               cb.like(cb.lower(labJoin.get("nombreLaboratorio")), like));

                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("titulo")), like),
                        cb.like(cb.lower(root.get("reto")), like),
                        cb.exists(techSub),
                        cb.exists(catSub),
                        cb.exists(labSub)
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
}
