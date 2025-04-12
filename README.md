# BPMN Fixer
This script is taking an existing BPMN as input. It gives all elements an ID (if they are omitted) and all nodes a name (if they are omitted).

It will then give all elements an `incoming` an `outgoing` element and will try to auto layout the resulting XML.

The XML that is exported can be opened using for example Camunda modeler. The resulting XML should be unaltered in behaviour, but will have a BPMN Layout included.


### Requirements
This script is developed with node version 22.

### Installation
```
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 22

# Verify the Node.js version:
node -v # Should print "v22.14.0".
nvm current # Should print "v22.14.0".

# Verify npm version:
npm -v # Should print "10.9.2".
```

### Usage
To run script, either use
```node index.js {path_to_bpmn} > {new_location}```

or

```npm start {path_to_bpmn} > {new_location}```

**Example**
```npm start ./demo/thales.training.passwordreset-login-two-fa.bpmn20.xml > ~/Desktop/thales.training.passwordreset-login-two-fa.fixed.bpmn20.xml```