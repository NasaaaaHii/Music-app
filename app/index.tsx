import {Text, TextInput, View} from "react-native";
import {useState} from "react";

export default function Index() {
    const [text,setText] = useState<string>("");

  return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            <TextInput
                placeholder={"Enter here....."}
                onChangeText={newText => setText(newText)}
                defaultValue={text}
                style={{
                    height:40,
                    padding: 5,
                    marginHorizontal: 5,
                    borderWidth: 1,
                }}
            />
            <Text style={{padding: 10, fontSize: 42}} >
                {text.split(' ').map(word => word && '@').join(' ')}
            </Text>
        </View>
  );
}
