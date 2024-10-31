import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  handleShowPassword?: () => void;
  showPassword?: boolean;
  isPass?: boolean;
  icon: any;
  type: string;
  register?: any;
  name?:any
}

const Input = ({
  icon: Icon,
  type,
  name,
  register,
  handleShowPassword,
  showPassword,
  isPass,
  ...props
}: InputProps) => {
  return (
    <div className="relative mb-6 ">
      <div className=" absolute inset-y-0 flex items-center pl-3 pointer-events-none left-0">
        <Icon className="size-5 text-green-500" />
      </div>
      <input
        {...props}
        type={type}
        {...(register ? register(name) : {})}
        name={name}
        className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200 "
      />
      {isPass && (
        <div
          className={`absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2`}
        >
          {showPassword ? (
            <Eye size={18} color="white" onClick={handleShowPassword} />
          ) : (
            <EyeOff size={18} color="white" onClick={handleShowPassword} />
          )}
        </div>
      )}
    </div>
  );
};

export default Input;
