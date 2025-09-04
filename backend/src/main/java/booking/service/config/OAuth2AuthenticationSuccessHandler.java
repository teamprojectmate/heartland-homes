package booking.service.config;

import booking.service.model.CustomUserPrincipal;
import booking.service.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User authenticationPrincipal = (OAuth2User) authentication.getPrincipal();
        String email = ((CustomUserPrincipal) authenticationPrincipal).getUsername();
        String token = jwtUtil.generateToken(email);

        response.setContentType("text/html");
        response.getWriter().write(String.format(
                """
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Authentication Success</title>
                </head>
                <body>
                    <script>
                        window.opener.postMessage({
                            type: 'OAUTH_SUCCESS',
                            token: '%s'
                        }, '*');
                        window.close();
                    </script>
                    <p>Authentication successful! This window will close automatically.</p>
                </body>
                </html>
                """, token));
        response.getWriter().flush();
    }
}
