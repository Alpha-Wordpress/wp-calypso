# Version

Version is a React component for rendering a version number

## Usage

```jsx
import Version from 'calypso/components/version';

function MyComponent() {
	return <Version version={ 123 } icon="plugins" />;
}
```

## Props

The following props can be passed to the Version component:

| property  | type             | required | comment                                               |
| --------- | ---------------- | -------- | ----------------------------------------------------- |
| `version` | String or Number | yes      | The version number that you want to display.          |
| `icon`    | String           | no       | The Gridicon you want to display next to the version. |
