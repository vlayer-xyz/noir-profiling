import { Abi } from "@noir-lang/noirc_abi";

export function filterPublic(abi: Abi): Abi {
  return {
    ...abi,
    parameters: abi.parameters.filter((parameter) => parameter.visibility === "public"),
  };
}
