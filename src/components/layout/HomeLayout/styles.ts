import { colorTheme } from "../../../definitions";
import { CSSProperties } from "react";

export const containerHomeStyles = { 
        height: "100%", 
        background: `url("/assets/img/bri-tech-bg.jpeg")`,
        backgroundRepeat: "no-repeat",
        width: "100%",
        backgroundPosition: "70% 100%",
        backgroundSize: "250vw 150vh" 
    }
export const containerHomeContentStyles = { backgroundColor: "transparent" }
export const wrapperHomeContentStyles = {
    height: "100vh",
    padding: "3vh",
}

export const headerStyles: CSSProperties = {
    backgroundColor: colorTheme.Background.header["light"],
    display: "flex",
    alignItems: "center",
    padding: "0px 24px",
    height: "80px",
}

export const containerHeaderStyles: CSSProperties = { flex: "1", display: "flex" }
export const wrapperTitleHeaderStyles: CSSProperties = {
    fontSize: "26px",
    flex: 4,
    color: colorTheme.Background.header.text["light"],
    fontFamily: "SF Pro Display",
    fontWeight: 800,
    cursor: "pointer",
}
export const wrapperMenuHeaderStyles: CSSProperties = { flex: 8, display: "flex", justifyContent: "flex-end" }
export const buttonIconHeaderStyles: CSSProperties = {
    backgroundColor: colorTheme.Background.header["light"],
    color: colorTheme.Background.header.icon["light"],
}
export const textHeaderStyles: CSSProperties = {
    color: colorTheme.Background.header["text"]["light"],
}