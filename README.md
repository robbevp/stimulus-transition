# Stimulus Transition

Enter/Leave transitions for Stimulus - based on the syntax from Vue and Alpine.
The controller watches for changes to the `hidden`-attribute to automatically run the transitions.

## Install

Run `yarn add stimulus-transition` to install

Register the controller in your application
```
import { Application } from "stimulus"
import TransitionController from 'stimulus-transition'

const application = Application.start()
application.register("transition", TransitionController)
```

## Usage

Add the `transition` controller to each element you want to transition and add classes for the transition.

```HTML
<div data-controller="transition"
     data-transition-enter-active="enter-class"
     data-transition-enter-from="enter-from-class"
     data-transition-enter-to="enter-to-class"
     data-transition-leave-active="or-use multiple classes"
     data-transition-leave-from="or-use multiple classes"
     data-transition-leave-to="or-use multiple classes">
  <!-- content -->
</div>
```

The controller watch for changes to the `hidden`-attribute on the exact element. Add, remove or change the attribute to trigger the enter or leave transition.

For example another controller might contain:

```javascript
export default class extends Controller {
  static targets = ["options"]

  showOptions() {
    this.optionsTarget.hidden = false;
  }

  hideOptions() {
    this.optionsTarget.hidden = true;
  }
}
```
### Optional classes
If you don't need one of the classes, you can omit the attributes. The following will just transition on enter:
```HTML
<div data-controller="transition"
     data-transition-enter-active="enter-class"
     data-transition-enter-from="enter-from-class"
     data-transition-enter-to="enter-to-class">
  <!-- content -->
</div>
```
### Initial transition
If you want to run the transition when the element, you should add the `data-transition-initial-value`-attribute to the element. It's value isn't used.
```HTML
<div data-controller="transition"
     data-transition-initial-value
     data-transition-enter-active="enter-class"
     data-transition-enter-from="enter-from-class"
     data-transition-enter-to="enter-to-class">
  <!-- content -->
</div>
```
### Manual triggers

You can also manually trigger the transitions, by calling `enter`, `leave`, `destroy`

<div class="h-10 w-10"
     data-controller="transition"
     data-transition-enter-active="enter-class"
     data-transition-enter-from="enter-from-class"
     data-transition-enter-to="enter-to-class"
     data-transition-leave-active="or-use multiple classes"
     data-transition-leave-from="or-use multiple classes"
     data-transition-leave-to="or-use multiple classes"
     data-action="click->transition#enter">
  <button data-action="transition#leave">Run leave transition and hide element</button>
  <button data-action="transition#destroy">Run leave transition and remove element from DOM</button>
</div>

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/robbevp/stimulus-transition. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the Contributor Covenant code of conduct.

## License

This package is available as open source under the terms of the MIT License.

## Credits
This implementation is inspired by [the following article from Sebastian De Deyne](https://sebastiandedeyne.com/javascript-framework-diet/enter-leave-transitions/) - it's an interesting read to understand what is happening in these transitions.
