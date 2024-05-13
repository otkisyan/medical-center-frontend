export interface UserDetails {
  id: number;
  username: string | undefined;
  roles: string[];
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
}
