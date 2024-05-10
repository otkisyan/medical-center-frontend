"use client";
import { createContext, useContext, useEffect } from "react";
import { UserContext } from "@/shared/interface/user/userContextInterface";
import { useState } from "react";
import { UserDetails } from "@/shared/interface/user/userDetailsInterface";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "@/shared/service/userService";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const UserContextInstance = createContext<UserContext>({} as UserContext);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isReady, setIsReady] = useState(true);
  const router = useRouter();

  const logout = async () => {
    setUserDetails(null);
    localStorage.removeItem("access_token");
    router.push("/login?logout=true");
    try {
      await AuthService.logout();
    } catch (error) {}
  };

  const fetchUserDetails = useCallback(async () => {
    try {
      const res = await AuthService.getUserDetails();
      if (res) {
        const userDetailsObject: UserDetails = {
          id: res.id,
          username: res.username,
          roles: res.roles,
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
    fetchUserDetails();
  }, [fetchUserDetails]);

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
          router.push("/login?error=true");
        }
        if (decodedToken) {
          localStorage.setItem("access_token", accessToken);
          router.push("/");
        }
      }
    } catch (error) {
      router.push("/login?error=true");
    }
  };

  const isAuthenticated = () => {
    return !!userDetails;
  };

  return (
    <UserContextInstance.Provider
      value={{
        userDetails: userDetails,
        login: login,
        isAuthenticated: isAuthenticated,
        logout: logout,
      }}
    >
      {isReady ? children : null}
    </UserContextInstance.Provider>
  );
};

export const useAuth = () => useContext(UserContextInstance);
