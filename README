# YAML sed

YAML sed helps you to modify yaml files from command line easily.

# Installation

`npm i -g ysed`
To install npm see [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm).

# Usage

`ysed <some_yaml_file.yaml> [updates]`

ysed reads the yaml file, applies specified updates and writes updated yaml into stdout.

This can be used with kubectl:

`ysed <yaml> [updates] | kubectl apply -f-`

## Supported updates

* `some.path[index].to.element=new_value`
If an element matches given path exactly in any YAML document in input file, value of that field will be updated to `new_value`
* `env(ENV_VARIABLE_NAME)=new_value`
Any environment variable in containers match ENV_VARIABLE_NAME, then it's value will be updated to `new_value`

### Example

```
file: my_yaml
for: demonstration
content:
  field1: value1
  field2: value2
  containers:
  - name: busybox1
    env:
    - name: VAR1
      value: value3
    - name: VAR2
      value: value4
---
file: doc2
for: demonstration
content:
  field3: value5
  field4: value6
  containers:
  - name: busybox2
    env:
    - name: VAR3
      value: value7
    - name: VAR4
      value: value8
    - name: VAR5
      value: value9
```

`ysed demo.yaml content.containers[0].env[2].value=new_value1 env[VAR4]=new_value2`
will print:
```
- file: my_yaml
  for: demonstration
  content:
    field1: value1
    field2: value2
    containers:
      - name: busybox1
        env:
          - name: VAR1
            value: value3
          - name: VAR2
            value: value4
- file: doc2
  for: demonstration
  content:
    field3: value5
    field4: value6
    containers:
      - name: busybox2
        env:
          - name: VAR3
            value: value7
          - name: VAR4
            value: new_value2
          - name: VAR5
            value: new_value1
```
