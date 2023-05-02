import { extendTheme } from "@chakra-ui/react";

const customButtonVariant = {
  // height: "50px",
  // width: "150px",
  borderRadius: "0px",
};

const theme = extendTheme({
  components: {
    Button: {
      variants: {
        buttonBlack: {
          fontFamily: "Oswald",
          fontSize: "14px",
          fontWeight: "500",
          lineHeight: "21px",
          letterSpacing: "0.5px",
          textAlign: "center",
          bg: "black",
          color: "white",
          borderRadius: "0px",
          _hover: {
            bg: "gray.700",
            boxShadow: "0px 4px 4px 0px #00000040",
          },
          _active: {
            bg: "gray.800",
            boxShadow: "0px 4px 4px 0px #00000040",
          },
        },
        buttonWhite: {
          fontFamily: "Oswald",
          fontSize: "14px",
          fontWeight: "500",
          lineHeight: "21px",
          letterSpacing: "0.5px",
          textAlign: "center",
          bg: "white",
          color: "black",
          borderRadius: "0px",
          border: "2px solid ",
          borderColor: "gray.200",

          _hover: {
            bg: "gray.100",
            boxShadow: "0px 4px 4px 0px #00000040",
          },
          _active: {
            bg: "gray.200",
            boxShadow: "0px 4px 4px 0px #00000040",
          },
        },
      },
    },
    Text: {
      variants: {
        linkText: {
          fontFamily: "Roboto",
          className: "text-gray-600 dark:text-gray-400",
        },
      },
    },
  },
});

export default theme;
