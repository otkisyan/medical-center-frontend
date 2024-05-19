import { Role } from "@/shared/enum/role";

export interface UserDetails {
  id: number;
  username: string | undefined;
  roles: Role[];
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
}
