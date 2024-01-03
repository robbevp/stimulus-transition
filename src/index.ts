import { Controller } from "stimulus";

export default class extends Controller {
  static values = { initial: Boolean, destroy: Boolean };
  hasDestroyValue: boolean;
  hasInitialValue: boolean;
  observer: MutationObserver;
  currentDisplayStyle: string;

  initialize(): void {
    this.observer = new MutationObserver((mutations) => {
      this.observer.disconnect();
      this.verifyChange.call(this, mutations);
    });
    if (this.hasInitialValue) this.enter();
    else this.startObserver();
  }

  async enter(): Promise<void> {
    await this.runTransition("enter");
    this.dispatchEnd("enter");
    this.startObserver();
  }

  async leave(attribute?: string | null): Promise<void> {
    // Cancel out the display style
    if (attribute === "hidden") (this.element as HTMLElement).hidden = false;
    else this.displayStyle = this.currentDisplayStyle;

    await this.runTransition("leave");

    // Restore the display style to previous value
    if (attribute === "hidden") (this.element as HTMLElement).hidden = true;
    else this.displayStyle = attribute === "style" ? "none" : undefined;

    this.dispatchEnd("leave");

    // Destroy element, or restart observer
    if (this.hasDestroyValue) this.element.remove();
    else this.startObserver();
  }

  // Helpers for transition
  private nextFrame(): Promise<number> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
  }

  private afterTransition(): Promise<void> {
    return new Promise((resolve) => {
      const duration =
        Number(
          getComputedStyle(this.element)
            .transitionDuration.split(",")[0]
            .replace("s", ""),
        ) * 1000;

      setTimeout(() => {
        resolve();
      }, duration);
    });
  }

  private async runTransition(dir: "enter" | "leave"): Promise<void> {
    const activeClasses = this.getTransitionClasses(`${dir}-active`);
    const fromClasses = this.getTransitionClasses(`${dir}-from`);
    const toClasses = this.getTransitionClasses(`${dir}-to`);

    this.element.classList.add(...activeClasses);
    this.element.classList.add(...fromClasses);

    await this.nextFrame();

    this.element.classList.remove(...fromClasses);
    this.element.classList.add(...toClasses);

    await this.afterTransition();

    this.element.classList.remove(...toClasses);
    this.element.classList.remove(...activeClasses);
  }

  private getTransitionClasses(name: string): string[] {
    return (
      this.element.getAttribute(`data-transition-${name}`)?.split(" ") ?? []
    );
  }

  private dispatchEnd(dir: "enter" | "leave") {
    const type = `transition:end-${dir}`;
    const event = new CustomEvent(type, { bubbles: true, cancelable: true });
    this.element.dispatchEvent(event);
    return event;
  }

  private get display(): string {
    return getComputedStyle(this.element)["display"];
  }

  private set displayStyle(v: string | undefined) {
    v
      ? (this.element as HTMLElement).style.setProperty("display", v)
      : (this.element as HTMLElement).style.removeProperty("display");
  }

  // Helpers for observer
  private verifyChange(mutations: MutationRecord[]): void {
    const newDisplayStyle = this.display;

    // Make sure there is a new computed displayStyle && the it was or will be "none"
    if (
      newDisplayStyle !== this.currentDisplayStyle &&
      (newDisplayStyle === "none" || this.currentDisplayStyle === "none")
    )
      newDisplayStyle === "none"
        ? this.leave(mutations[0].attributeName)
        : this.enter();
    else this.startObserver();
  }

  private startObserver(): void {
    this.currentDisplayStyle = this.display;
    if (this.element.isConnected)
      this.observer.observe(this.element, {
        attributeFilter: ["class", "hidden", "style"],
      });
  }
}
