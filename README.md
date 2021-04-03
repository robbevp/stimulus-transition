# Stimulus Transition

Enter/Leave transitions for Stimulus - based on the syntax from Vue and Alpine.  
The controller watches for changes to computed display style to automatically run the transitions. This could be an added/removed class, a changed is the element's `style`-attribute or the `hidden`-attribute. 

## Install

Run `yarn add stimulus-transition` to install

Register the controller in your application
```javascript
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

The controller watch for changes to the computed display style on the exact element. You can trigger this by changing the classList, the element's style or with the `hidden`-attribute. If the change would cause the element to appear/disappear, the transition will run.

During the transition, the effect of your change will be canceled out and be reset afterwards. This controller will not change the display style itself.

All of the below should trigger a transition.

```javascript
export default class extends Controller {
  static targets = ["options"]

  showOptions() {
    this.optionsTarget.hidden = false;
  }

  hideOptions() {
    this.optionsTarget.hidden = true;
  }

  addClass() {
    this.optionsTarget.classList.add("hidden")
  }

  removeClass() {
    this.optionsTarget.classList.add("hidden")
  }

  setDisplayNone() {
    this.optionsTarget.style.setProperty("display", "none")
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
If you want to run the transition when the element in entered in the DOM, you should add the `data-transition-initial-value`-attribute to the element. The value you enter is not used.
```HTML
<div data-controller="transition"
     data-transition-initial-value
     data-transition-enter-active="enter-class"
     data-transition-enter-from="enter-from-class"
     data-transition-enter-to="enter-to-class">
  <!-- content -->
</div>
```
### Destroy after leave

You can also destroy the element after running the leave transition by adding `data-transition-destroy-value`

```HTML
<div data-controller="transition"
     data-transition-destroy-value
     data-transition-enter-active="enter-class"
     data-transition-enter-from="enter-from-class"
     data-transition-enter-to="enter-to-class"
     data-transition-leave-active="or-use multiple classes"
     data-transition-leave-from="or-use multiple classes"
     data-transition-leave-to="or-use multiple classes">
</div>
```

### Listen for transitions

If you want to run another action after the transition is completed, you can listen for the following events on the element.
* `transition:end-enter`
* `transition:end-leave`

This would look something like:
```HTML
<div data-controller="transition"
     data-transition-enter-active="enter-class"
     data-transition-enter-from="enter-from-class"
     data-transition-enter-to="enter-to-class"
     data-action="transition:end-enter->controller#action">
  <!-- content -->
</div>
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/robbevp/stimulus-transition. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the Contributor Covenant code of conduct.

## License

This package is available as open source under the terms of the MIT License.

## Credits
This implementation of the transition is inspired by [the following article from Sebastian De Deyne](https://sebastiandedeyne.com/javascript-framework-diet/enter-leave-transitions/) - it's an interesting read to understand what is happening in these transitions.
