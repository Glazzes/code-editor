import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {theme} from '../data/theme';

const GetStarted: React.FC = () => {
  return (
    <ScrollView style={styles.root}>
      <View style={styles.mainInfoContainer}>
        <View style={styles.information}>
          <Text style={styles.informationText}>
            ¿Eres un reclutador? ¿Alguien sin experiencia tecnica? o simplemente no sabes que hacer en este
            proyecto, no te preocupes, puedes ver un video donde te explico la funcionalidad detras de
            este proyecto dando click aqui.
          </Text>
        </View>

        <h1 style={styles.title}>Comencemos</h1>

        <Text style={styles.text}>
          ¡Bienvenido a Borealis! Borealis es un campo de juego (Playground) donde los desarrolladores pueden 
          probar sus archivos de codigo y/o funciones en cinco lenguages de programacion diferentes 
          entre los que se encuentran Bash, Go, Java, JavaScript y Python, cabe resaltar que la inclusion de 
          nuevos lenguages de programacion es una tarea simple de implementar.
        </Text>

        <View style={styles.warning}>
          <Text style={styles.warningText}>
            Todo tu codigo se ejecuta en completa isolacion, eso quiere decir que tener varias pestañas
            con el mismo lenguaje de programcion no significa que dichos archivos puedan importar codigo
            entere ellos.
          </Text>
        </View>
      </View>

      <h3 style={styles.keyboardShortcutsTitle}>Atajos de teclado</h3>
      <View style={styles.keyboardShortcutContainer}>
        <Text style={styles.text}>
          <span style={styles.chipContainer}>ctrl</span> + <span style={styles.chipContainer}>a</span> 
          {" "}crear una nueva pestaña
        </Text>
        <Text style={styles.text}>
          <span style={styles.chipContainer}>ctrl</span> + <span style={styles.chipContainer}>k</span> 
          {" "}cerrar pestaña activa
        </Text>
        <Text style={styles.text}>
          <span style={styles.chipContainer}>ctrl</span> + <span style={styles.chipContainer}>q</span> 
          {" "}cerrar todas las pestañas
        </Text>

        <Text style={styles.text}>
          <span style={styles.chipContainer}>ctrl</span> + <span style={styles.chipContainer}>r</span> 
          {" "}Ejecutar codigo en la pestaña activa
        </Text>

        <Text style={styles.text}>
          <span style={styles.chipContainer}>ctrl</span> + <span style={styles.chipContainer}>h</span> 
          {" "}Ir al historial de ejecucion
        </Text>

        <Text style={styles.text}>
          <span style={styles.chipContainer}>alt</span> + <span style={styles.chipContainer}>numero</span> 
          {" "}Ir a la pestaña
        </Text>
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: theme.spacing.s16,
    overflowY: "scroll"
  },
  mainInfoContainer: {
    gap: theme.spacing.s4,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.sizes.titleSize,
    color: theme.colors.getStarted.textColor,
    marginTop: 0,
    marginBottom: 0
  },
  information: {
    backgroundColor: theme.colors.getStarted.infoBacgroundColor,
    padding: theme.spacing.s4,
    borderRadius: theme.spacing.s2,
  },
  informationText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.getStarted.infoTextColor
  },
  warning: {
    backgroundColor: theme.colors.getStarted.warningBackgroundColor,
    padding: theme.spacing.s4,
    borderRadius: theme.spacing.s2
  },
  warningText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.getStarted.warningTextColor
  },
  text: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.getStarted.textColor,
    fontSize: 16
  },
  keyboardShortcutContainer: {
    gap: theme.spacing.s4,
  },
  keyboardShortcutsTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.getStarted.textColor
  },
  chipContainer: {
    fontFamily: theme.fonts.medium,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.s1,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: theme.spacing.s1,
    width: 100,
   
  },
  keyChip: {
    fontFamily: theme.fonts.medium,
    minWidth: 40,
    padding: theme.spacing.s1
  }
});

export default GetStarted;
