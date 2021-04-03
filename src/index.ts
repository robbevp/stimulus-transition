import { Controller } from "stimulus";

export default class extends Controller {
  static values = { initial: String };
  hasInitialValue: boolean;
  observer: MutationObserver;

  initialize(): void {
    this.observer = new MutationObserver(() => {
      this.observer.disconnect();
      this.triggerTransition.call(this);
    });
    if (this.hasInitialValue) this.enter();
    else this.startObserver();
  }

  triggerTransition(): void {
    (this.element as HTMLElement).hidden ? this.leave() : this.enter();
  }

  async enter(): Promise<void> {
    (this.element as HTMLElement).hidden = false;
    await this.runTransition("enter");
    this.dispatchEnd("enter");
    this.startObserver();
  }

  async leave(): Promise<void> {
    (this.element as HTMLElement).hidden = false;
    await this.runTransition("leave");
    (this.element as HTMLElement).hidden = true;
    this.dispatchEnd("leave");
    this.startObserver();
  }

  async destroy(): Promise<void> {
    await this.leave();
    this.dispatchEnd("destroy");
    this.element.remove();
  }

  // Private functions
  private startObserver(): void {
    if (this.element.isConnected)
      this.observer.observe(this.element, { attributeFilter: ["hidden"] });
  }

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
            .replace("s", "")
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

  private dispatchEnd(name: "enter" | "leave" | "destroy") {
    const type = `transition:end-${name}`;
    const event = new CustomEvent(type, { bubbles: true, cancelable: true });
    this.element.dispatchEvent(event);
    return event;
  }
}
