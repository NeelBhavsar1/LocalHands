package com.localhands.backend.init;

import com.localhands.backend.entity.ListingCategory;
import com.localhands.backend.entity.ListingCategoryName;
import com.localhands.backend.entity.Role;
import com.localhands.backend.entity.RoleName;
import com.localhands.backend.repository.ListingCategoryRepository;
import com.localhands.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class seeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final ListingCategoryRepository listingCategoryRepository;

    @Override
    public void run(String... args) {

        for (RoleName roleName : RoleName.values()) {
            if (!roleRepository.existsByRoleName(roleName)) {
                Role role = new Role();
                role.setRoleName(roleName);
                roleRepository.save(role);
            }
        }

        for (ListingCategoryName listingCategoryName : ListingCategoryName.values()) {
            if (!listingCategoryRepository.existsByCategory(listingCategoryName)) {
                ListingCategory listingCategory = new ListingCategory();
                listingCategory.setCategory(listingCategoryName);
                listingCategoryRepository.save(listingCategory);
            }
        }
    }
}