"use client";
import { createContext, useContext, useEffect } from "react";
import { IUserContext } from "@/interface/user/userContext.interface";
import { useState } from "react";
import { IUserProfile } from "@/interface/user/userProfile.interface";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "@/service/auth.service";
import { useRouter } from "next/navigation";

const UserContext = createContext<IUserContext | null>(null);

export const UserContextProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      let decodedToken = undefined;
      try {
        decodedToken = jwtDecode(accessToken);
      } catch (error) {
        logout();
      }
      if (decodedToken) {
        const userProfileFromToken: IUserProfile = {
          id: decodedToken.userId,
          username: decodedToken.sub,
        };
        setUserProfile(userProfileFromToken);
      }
    }
    setIsReady(true);
  }, []);

  const login = async (username: string, password: string) => {
    await AuthService.loginUser(username, password).then((res) => {
      if (res) {
        let decodedToken = undefined;
        try {
          decodedToken = jwtDecode(res?.data.accessToken);
        } catch (error) {
          logout();
        }
        if (decodedToken) {
          const userProfileFromToken: IUserProfile = {
            id: decodedToken.userId,
            username: decodedToken.sub,
          };
          setUserProfile(userProfileFromToken);
          localStorage.setItem("access_token", res?.data.accessToken);
          router.push("/patients");
        }
      }
    });
  };

  const isLoggedIn = () => {
    return !!userProfile;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUserProfile(null);
    router.push("/login");
  };

  return (
    <UserContext.Provider value={{ userProfile, login, isLoggedIn, logout }}>
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
