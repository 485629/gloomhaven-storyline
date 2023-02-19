import Vue from "vue";
import FontSelected from "../../components/elements/FontSwitch.vue";

export default function getFont() {
    const fontSelectedClass = Vue.extend(FontSelected);
    const fontSelectedComponent = new fontSelectedClass;
    return fontSelectedComponent.getFont();
}
