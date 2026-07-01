package com.softgic.centralization.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.softgic.centralization.dto.RecursoDTO;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

@Converter
public class RecursoListConverter implements AttributeConverter<List<RecursoDTO>, String> {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<RecursoDTO> recursos) {
        if (recursos == null || recursos.isEmpty()) return null;
        try {
            return mapper.writeValueAsString(recursos);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    @Override
    public List<RecursoDTO> convertToEntityAttribute(String json) {
        if (json == null || json.isBlank()) return new ArrayList<>();
        try {
            return mapper.readValue(json, new TypeReference<List<RecursoDTO>>() {});
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
}
