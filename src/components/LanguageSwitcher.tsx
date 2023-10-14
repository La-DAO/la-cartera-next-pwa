import { useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Portal,
} from "@chakra-ui/react";

export default function LanguageSwitcher() {
  const [appLanguage, setAppLanguage] = useState("es");
  const { i18n } = useTranslation("common");

  const esLanguageBtnRef = useRef<HTMLButtonElement | null>(null);
  const enLanguageBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleLanguageChange = async (selectedLanguage: string) => {
    await i18n.changeLanguage(selectedLanguage);
    setAppLanguage(selectedLanguage);
  };

  return (
    <Menu
      autoSelect={false}
      // initialFocusRef={
      //   appLanguage === "es" ? esLanguageBtnRef : enLanguageBtnRef
      // }
    >
      <MenuButton
        as={Button}
        variant="secondary"
        rightIcon={<ChevronDownIcon />}
        minWidth={0}
        pl={4}
        pr={2}
        gap={2}
        size="sm"
        width={16}
      >
        {appLanguage}
      </MenuButton>
      <Portal>
        <MenuList minWidth={0} width={16}>
          <MenuItem
            justifyContent="center"
            textDecoration={appLanguage === "es" ? "underline" : "none"}
            textDecorationColor="primary"
            textUnderlineOffset={4}
            textDecorationThickness="2px"
            ref={esLanguageBtnRef}
            onClick={() => handleLanguageChange("es")}
          >
            es
          </MenuItem>
          <MenuItem
            justifyContent="center"
            textDecoration={appLanguage === "en" ? "underline" : "none"}
            textDecorationColor="primary"
            textUnderlineOffset={4}
            textDecorationThickness="2px"
            ref={enLanguageBtnRef}
            onClick={() => handleLanguageChange("en")}
          >
            en
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
}
