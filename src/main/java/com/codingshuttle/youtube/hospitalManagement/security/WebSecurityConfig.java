//package com.codingshuttle.youtube.hospitalManagement.security;
//
//import com.codingshuttle.youtube.hospitalManagement.entity.type.PermissionType;
//import com.codingshuttle.youtube.hospitalManagement.entity.type.RoleType;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.access.AccessDeniedException;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configurers.ExceptionHandlingConfigurer;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.access.AccessDeniedHandler;
//import org.springframework.security.web.authentication.AuthenticationFailureHandler;
//import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.servlet.HandlerExceptionResolver;
//
//import java.io.IOException;
//
//import static com.codingshuttle.youtube.hospitalManagement.entity.type.PermissionType.*;
//import static com.codingshuttle.youtube.hospitalManagement.entity.type.RoleType.*;

package com.codingshuttle.youtube.hospitalManagement.security;

import com.codingshuttle.youtube.hospitalManagement.entity.type.PermissionType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.util.List;

import static com.codingshuttle.youtube.hospitalManagement.entity.type.PermissionType.*;
import static com.codingshuttle.youtube.hospitalManagement.entity.type.RoleType.*;

@Configuration
@RequiredArgsConstructor
@Slf4j
@EnableMethodSecurity
public class WebSecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final HandlerExceptionResolver handlerExceptionResolver;

    // ----------- GLOBAL CORS CONFIG -----------
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",                              // local Vite dev server
                "https://hospital-management-delta-dun.vercel.app"    // your deployed frontend
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }

    // ----------- SECURITY FILTER CHAIN -----------
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/public/**", "/auth/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/admin/**")
                        .hasAnyAuthority(APPOINTMENT_DELETE.name(), USER_MANAGE.name())
                        .requestMatchers("/admin/**").hasRole(ADMIN.name())
                        .requestMatchers("/doctors/**").hasAnyRole(DOCTOR.name(), ADMIN.name())
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex ->
                        ex.accessDeniedHandler((req, res, e) -> {
                            handlerExceptionResolver.resolveException(req, res, null, e);
                        })
                );

        return http.build();
    }
}



//
//@Configuration
//@RequiredArgsConstructor
//@Slf4j
//@EnableMethodSecurity
//public class WebSecurityConfig {
//
//    private final JwtAuthFilter jwtAuthFilter;
//    private final OAuth2SuccessHandler oAuth2SuccessHandler;
//    private final HandlerExceptionResolver handlerExceptionResolver;
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
//        httpSecurity
//                .csrf(csrfConfig -> csrfConfig.disable())
//                .sessionManagement(sessionConfig ->
//                        sessionConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/public/**", "/auth/**").permitAll()
//                        .requestMatchers(HttpMethod.DELETE, "/admin/**")
//                            .hasAnyAuthority(APPOINTMENT_DELETE.name(),
//                                USER_MANAGE.name())
//                        .requestMatchers("/admin/**").hasRole(ADMIN.name())
//                        .requestMatchers("/doctors/**").hasAnyRole(DOCTOR.name(), ADMIN.name())
//                        .anyRequest().authenticated()
//                )
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
////                .oauth2Login(oAuth2 -> oAuth2
////                        .failureHandler((request, response, exception) -> {
////                            log.error("OAuth2 error: {}", exception.getMessage());
////                            handlerExceptionResolver.resolveException(request, response, null, exception);
////                        })
////                        .successHandler(oAuth2SuccessHandler)
////                )
//                .exceptionHandling(exceptionHandlingConfigurer ->
//                        exceptionHandlingConfigurer.accessDeniedHandler((request, response, accessDeniedException) -> {
//                            handlerExceptionResolver.resolveException(request, response, null, accessDeniedException);
//                        }));
//
////                .formLogin();
//        return httpSecurity.build();
//    }
//
//}
