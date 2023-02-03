export default class Component extends HTMLElement {

  getAttribute(qualifiedName: string, defaultValue?: any): string {
    return super.getAttribute(qualifiedName) || defaultValue;
  }

  getOptionalAttribute(qualifiedName: string, defaultValue: any): any {
    return this.getAttribute(qualifiedName, defaultValue);
  }

}
