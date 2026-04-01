package com.localhands.backend.service.implementation;

import com.localhands.backend.exception.AppException;
import com.localhands.backend.service.EmailSenderService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderServiceImpl implements EmailSenderService {

    private final JavaMailSender javaMailSender;
    private final String fromEmail;

    public EmailSenderServiceImpl(JavaMailSender javaMailSender, @Value("${spring.mail.username}") String fromEmail) {
        this.javaMailSender = javaMailSender;
        this.fromEmail = fromEmail;
    }

    @Override
    public void sendEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(toEmail);
            message.setFrom(fromEmail);
            message.setSubject(subject);
            message.setText(body);

            javaMailSender.send(message);

            System.out.println("Email sent successfully!");
        } catch (Exception e) {
            throw new AppException("Could not send password reset email confirmation.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
