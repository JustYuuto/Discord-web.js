export default class Component extends HTMLElement {

    getAttribute(qualifiedName: string): string {
        const attribute = super.getAttribute(qualifiedName);
        if (!attribute) throw new Error(`No attribute ${qualifiedName} found`);
        return attribute;
    }

    getOptionalAttribute(qualifiedName: string, defaultValue: any): any {
        return super.getAttribute(qualifiedName) || defaultValue;
    }

}
