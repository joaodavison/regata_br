import { TextInput, TextInputProps } from "react-native";
import { style } from "./styles";

// componente input com todas as propriedades disponiveis (rest)
export function Input({...rest}:TextInputProps ){

    return <TextInput style={style.input} {...rest} />
}