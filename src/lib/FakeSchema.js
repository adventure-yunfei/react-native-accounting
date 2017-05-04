/* eslint-disable */
export default class FakeSchema {
  constructor(schemaDef) {
    this.validate = schemaDef.$validate;
  }

  validate(data) {
    return true;
  }
}
