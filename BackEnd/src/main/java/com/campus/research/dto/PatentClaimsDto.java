package com.campus.research.dto;

import java.util.List;
import java.util.Map;

public class PatentClaimsDto {
    private Long id;
    private Long projectId;
    private Long ipFilingId;
    private String title;
    private String ipType;
    private String applicationNo;
    private int noveltyScore;
    private String ipcClassification;
    private String fieldOfInvention;
    private String backgroundAndDeficiencies;
    private String independentClaim1;
    private List<String> dependentClaims;
    private List<Map<String, Object>> priorArtCollisions;
    private String commercialReadinessTrl;
    private String filingRecommendation;
    private String generatedAt;

    public PatentClaimsDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Long getIpFilingId() { return ipFilingId; }
    public void setIpFilingId(Long ipFilingId) { this.ipFilingId = ipFilingId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getIpType() { return ipType; }
    public void setIpType(String ipType) { this.ipType = ipType; }

    public String getApplicationNo() { return applicationNo; }
    public void setApplicationNo(String applicationNo) { this.applicationNo = applicationNo; }

    public int getNoveltyScore() { return noveltyScore; }
    public void setNoveltyScore(int noveltyScore) { this.noveltyScore = noveltyScore; }

    public String getIpcClassification() { return ipcClassification; }
    public void setIpcClassification(String ipcClassification) { this.ipcClassification = ipcClassification; }

    public String getFieldOfInvention() { return fieldOfInvention; }
    public void setFieldOfInvention(String fieldOfInvention) { this.fieldOfInvention = fieldOfInvention; }

    public String getBackgroundAndDeficiencies() { return backgroundAndDeficiencies; }
    public void setBackgroundAndDeficiencies(String backgroundAndDeficiencies) { this.backgroundAndDeficiencies = backgroundAndDeficiencies; }

    public String getIndependentClaim1() { return independentClaim1; }
    public void setIndependentClaim1(String independentClaim1) { this.independentClaim1 = independentClaim1; }

    public List<String> getDependentClaims() { return dependentClaims; }
    public void setDependentClaims(List<String> dependentClaims) { this.dependentClaims = dependentClaims; }

    public List<Map<String, Object>> getPriorArtCollisions() { return priorArtCollisions; }
    public void setPriorArtCollisions(List<Map<String, Object>> priorArtCollisions) { this.priorArtCollisions = priorArtCollisions; }

    public String getCommercialReadinessTrl() { return commercialReadinessTrl; }
    public void setCommercialReadinessTrl(String commercialReadinessTrl) { this.commercialReadinessTrl = commercialReadinessTrl; }

    public String getFilingRecommendation() { return filingRecommendation; }
    public void setFilingRecommendation(String filingRecommendation) { this.filingRecommendation = filingRecommendation; }

    public String getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(String generatedAt) { this.generatedAt = generatedAt; }
}
