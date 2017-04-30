import { StyleSheet } from 'react-native';

export const editorVariables = {
  HorizonMargin: 16
};

export const editorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  row: {
    marginLeft: editorVariables.HorizonMargin,
    marginRight: editorVariables.HorizonMargin,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    borderStyle: 'solid'
  },

  row_lastChild: {
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: editorVariables.HorizonMargin,
    paddingRight: editorVariables.HorizonMargin
  },

  buttonBar: {
    position: 'absolute',
    bottom: 15
  }
});
