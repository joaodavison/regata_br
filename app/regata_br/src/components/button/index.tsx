import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native"
import { styles } from "./styles"

// Adicionando title com as propriedades do botao (ex. onPress)
type Props = TouchableOpacityProps & {
    title: string,
}

export function Button({title, onPress}: Props){
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.5} style={styles.button}>
            <Text style={styles.title}> {title}</Text>
        </TouchableOpacity>
    )
}