"use client";
import { createContext, useContext, useEffect } from "react";
import { IUserContext } from "@/shared/interface/user/userContext.interface";
import { useState } from "react";
import { IUserDetails } from "@/shared/interface/user/userDetails.interface";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "@/shared/service/auth.service";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const UserContext = createContext<IUserContext>({} as IUserContext);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userDetails, setUserDetails] = useState<IUserDetails | null>(null);
  const [isReady, setIsReady] = useState(true);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("access_token");
    setUserDetails(null);
    router.push("/login");
  };

  const fetchUserDetails = useCallback(async () => {
    try {
      const res = await AuthService.getUserDetails();
      if (res) {
        const userDetailsObject: IUserDetails = {
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
    const res = await AuthService.loginUser(username, password);
    if (res) {
      const accessToken = res?.data.accessToken;
      let decodedToken = undefined;
      try {
        decodedToken = jwtDecode(accessToken);
      } catch (error) {
        logout();
      }
      if (decodedToken) {
        localStorage.setItem("access_token", accessToken);
        router.push("/patients");
      }
    }
  };

  const isAuthenticated = () => {
    return !!userDetails;
  };

  return (
    <UserContext.Provider
      value={{
        userDetails: userDetails,
        login: login,
        isAuthenticated: isAuthenticated,
        logout: logout,
      }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
