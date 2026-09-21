package com.campus.research.service;

import com.campus.research.model.*;
import com.campus.research.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AcademicQueryService {

    private final AcademicQueryRepository queryRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public AcademicQueryService(
            AcademicQueryRepository queryRepository,
            UserRepository userRepository,
            NotificationRepository notificationRepository
    ) {
        this.queryRepository = queryRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public AcademicQuery submitQuery(Long senderId, String category, String subject, String message) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + senderId));

        AcademicQuery query = new AcademicQuery();
        query.setSender(sender);
        query.setUserRole(sender.getRole().name());
        query.setCategory(category != null ? category : "General Query");
        query.setSubject(subject);
        query.setMessage(message);
        query.setStatus(AcademicQuery.Status.OPEN);

        AcademicQuery saved = queryRepository.save(query);

        // Notify Academic Office
        List<User> academicsList = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.ACADEMIC_OFFICE)
                .toList();

        for (User academics : academicsList) {
            notificationRepository.save(new Notification(
                    null, academics.getId(),
                    "New Academic Helpdesk Query",
                    sender.getFullName() + " (" + sender.getRole() + ") submitted query: '" + subject + "'.",
                    "QUERY_SUBMITTED", false, LocalDateTime.now()
            ));
        }

        return saved;
    }

    public List<AcademicQuery> getQueries(String statusStr) {
        if (statusStr != null && !statusStr.isBlank() && !"ALL".equalsIgnoreCase(statusStr)) {
            AcademicQuery.Status status = AcademicQuery.Status.valueOf(statusStr.toUpperCase());
            return queryRepository.findByStatusOrderByCreatedAtDesc(status);
        }
        return queryRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<AcademicQuery> getUserQueries(Long userId) {
        return queryRepository.findBySenderIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public AcademicQuery replyToQuery(Long queryId, Long academicOfficerId, String replyMessage) {
        AcademicQuery query = queryRepository.findById(queryId)
                .orElseThrow(() -> new IllegalArgumentException("Query not found: " + queryId));

        User officer = academicOfficerId != null ? userRepository.findById(academicOfficerId).orElse(null) : null;

        query.setReplyMessage(replyMessage);
        query.setRepliedBy(officer);
        query.setStatus(AcademicQuery.Status.RESOLVED);
        query.setRepliedAt(LocalDateTime.now());

        AcademicQuery saved = queryRepository.save(query);

        // Send high-priority notification to sender (Student or Faculty)
        notificationRepository.save(new Notification(
                null, query.getSender().getId(),
                "Academic Office Resolution: " + query.getSubject(),
                replyMessage,
                "QUERY_RESOLVED", false, LocalDateTime.now()
        ));

        return saved;
    }
}
