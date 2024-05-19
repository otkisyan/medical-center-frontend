"use client";
import { createContext, useContext, useEffect } from "react";
import { UserContext } from "@/shared/interface/user/user-context-interface";
import { useState } from "react";
import { UserDetails } from "@/shared/interface/user/user-details-interface";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "@/shared/service/user-service";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { Role } from "../enum/role";
import { convertStringRolesToEnumRole } from "../utils/auth-utils";

const UserContextInstance = createContext<UserContext>({} as UserContext);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isReady, setIsReady] = useState(true);
  const router = useRouter();
  const path = usePathname();

  const logout = async () => {
    router.push("/login");
    try {
      AuthService.logout();
    } catch (error) {
    } finally {
      router.push("/login");
      setUserDetails(null);
      localStorage.removeItem("access_token");
    }
  };

  const fetchUserDetails = useCallback(async () => {
    try {
      const res = await AuthService.getUserDetails();
      if (res) {
        const rolesEnum = convertStringRolesToEnumRole(res.roles);
        const userDetailsObject: UserDetails = {
          id: res.id,
          username: res.username,
          roles: rolesEnum,
          accountNonExpired: res.accountNonExpired,
          accountNonLocked: res.accountNonLocked,
          credentialsNonExpired: res.credentialsNonExpired,
          enabled: res.enabled,
        };
        setUserDetails(userDetailsObject);
      }
    } catch (error) {
      setUserDetails(null);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (path !== "/login") {
      fetchUserDetails();
    }
  }, [fetchUserDetails, path]);

  const login = async (username: string, password: string) => {
    localStorage.removeItem("access_token");
    try {
      const res = await AuthService.loginUser(username, password);
      if (res) {
        const accessToken = res?.data.accessToken;
        let decodedToken = undefined;
        try {
          decodedToken = jwtDecode(accessToken);
        } catch (error) {
          throw error;
        }
        if (decodedToken) {
          localStorage.setItem("access_token", accessToken);
          router.push("/");
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const isAuthenticated = () => {
    return !!userDetails;
  };

  const hasAnyRole = (roles: Role[]) => {
    return roles.some((role) => userDetails?.roles.includes(role)) ?? false;
  };

  return (
    <UserContextInstance.Provider
      value={{
        userDetails: userDetails,
        login: login,
        isAuthenticated: isAuthenticated,
        logout: logout,
        hasAnyRole: hasAnyRole,
      }}
    >
      {isReady ? children : null}
    </UserContextInstance.Provider>
  );
};

export const useAuth = () => useContext(UserContextInstance);
