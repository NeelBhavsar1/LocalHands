package com.localhands.backend.service.implementation;

import com.localhands.backend.service.EmailSenderService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderServiceImpl implements EmailSenderService {

    private final JavaMailSender javaMailSender;
    private final String fromEmail;

    public EmailSenderServiceImpl(
            JavaMailSender javaMailSender,
            @Value("${spring.mail.username:}") String fromEmail) {
        this.javaMailSender = javaMailSender;
        this.fromEmail = fromEmail;
    }

    @Override
    public void sendEmail(String toEmail, String subject, String body) {

        if (fromEmail == null || fromEmail.isBlank()) {
            System.out.println("Email not configured. Skipping email send.");
            return;
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setFrom(fromEmail);
            helper.setSubject(subject);
            helper.setText(body, true);

            javaMailSender.send(message);

        } catch (Exception e) {
            System.out.println("Email failed to send: " + e.getMessage());
        }
    }
}