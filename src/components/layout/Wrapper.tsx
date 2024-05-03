import {useAuth} from "@/shared/context/UserContextProvider";

interface WrapperProps {
    children: React.ReactNode;
}

const WrapperComponent = ({ children }: WrapperProps) => {
    return <div className="wrapper">{children}</div>;
};

export default WrapperComponent;