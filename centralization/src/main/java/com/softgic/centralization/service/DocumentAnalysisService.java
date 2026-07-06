package com.softgic.centralization.service;

import java.io.InputStream;

import com.softgic.centralization.dto.DocumentAnalysisResultDTO;

public interface DocumentAnalysisService {

    DocumentAnalysisResultDTO analizar(InputStream fileStream, String filenameHeader, long contentLength);
}
