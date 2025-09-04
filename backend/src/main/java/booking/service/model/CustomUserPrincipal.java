package booking.service.model;

import java.util.Collection;
import java.util.Map;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

public class CustomUserPrincipal implements OAuth2User, UserDetails {

    private final User user;
    private final OAuth2User auth2User;

    public CustomUserPrincipal(User user, OAuth2User auth2User) {
        this.user = user;
        this.auth2User = auth2User;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRoles();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return !user.isDeleted();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return auth2User.getAttributes();
    }

    @Override
    public String getName() {
        return user.getEmail();
    }
}
