package booking.service.service.impl;

import booking.service.model.CustomUserPrincipal;
import booking.service.model.Role;
import booking.service.model.RoleName;
import booking.service.model.User;
import booking.service.repository.role.RoleRepository;
import booking.service.repository.user.UserRepository;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User auth2User = super.loadUser(userRequest);

        String email = auth2User.getAttribute("email");
        String firstName = auth2User.getAttribute("given_name");
        String lastName = auth2User.getAttribute("family_name");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    Role customerRole = roleRepository.findByName(RoleName.CUSTOMER)
                            .orElseThrow(() -> new RuntimeException("Role CUSTOMER not found"));

                    User newUser = new User()
                            .setEmail(email)
                            .setFirstName(firstName)
                            .setLastName(lastName)
                            .setPassword(passwordEncoder.encode("oauth2user"))
                            .setRoles(Set.of(customerRole));
                    return userRepository.save(newUser);
                });

        return new CustomUserPrincipal(user, auth2User);
    }
}
