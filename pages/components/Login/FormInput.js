import { FormControl, FormLabel, Input } from "@chakra-ui/react";

export default props =>
  props.v ? (
    <FormControl>
      <FormLabel>{props.p}</FormLabel>
      <Input
        focusBorderColor="black"
        placeholder={props.p}
        value={props.v[props.name]}
        onChange={props.onChange}
        name={props.name}
        type={props.t}
      />
    </FormControl>
  ) : (
    <></>
  );
