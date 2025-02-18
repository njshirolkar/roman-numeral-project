import React, { useState, useEffect } from 'react';
import {
  Provider,
  defaultTheme,
  Flex,
  TextField,
  Button,
  View
} from '@adobe/react-spectrum';

const App = () => {
  // Determine system's preferred color scheme.
  const getSystemColorScheme = (): 'light' | 'dark' => {
    try{
      return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    } catch (e){
      return 'light'; // Fallback if matchMedia isn't available
    }
  };

  // State for the color scheme.
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(getSystemColorScheme());
  // When false, follow the system; when true, user override is in effect.
  const [override, setOverride] = useState<boolean>(false);

  // Conversion mode: false = number-to-Roman, true = Roman-to-int.
  const [isReverse, setIsReverse] = useState<boolean>(false);
  // Bounded (default) mode vs. limitless (expanded) mode.
  const [limitlessMode, setLimitlessMode] = useState<boolean>(false);

  // State for input, result, and error.
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  // Update color scheme if user hasn't overridden.
  useEffect(() => {
    if (!override) {
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setColorScheme(mediaQuery.matches ? 'dark' : 'light');
  
        const handler = (e: MediaQueryListEvent) => {
          setColorScheme(e.matches ? 'dark' : 'light');
        };
  
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
      } catch (error) {
        console.error("Error accessing window.matchMedia:", error);
        setColorScheme('light'); // Fallback to light mode
      }
    }
  }, [override]);  

  // Toggle the color scheme manually.
  const toggleColorScheme = () => {
    setOverride(true);
    setColorScheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Toggle between conversion modes.
  const toggleConversionMode = () => {
    setInputValue(''); // clear input
    setResult('');
    setError('');
    setIsReverse(prev => !prev);
  };

  // Helper function to transform underscores to combining overlines.
  const formatRomanVinculum = (roman: string): string => {
    return roman.replace(/_([IVXLCDM])/g, (_, letter) => letter + "\u0305");
  };

  // Call the appropriate backend endpoint to convert the input.
  const handleConvert = async () => {
    setError('');
    setResult('');
    if (!inputValue) {
      setError("Please enter a value.");
      return;
    }
    try {
      const endpoint = isReverse 
        ? (limitlessMode ? '/romannumeralreverselimitless' : '/romannumeralreverse')
        : (limitlessMode ? '/romannumerallimitless' : '/romannumeral');
      const response = await fetch(`http://localhost:8080${endpoint}?query=${inputValue}`);
      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText);
        return;
      }
      const data = await response.json();
      setResult(data.output);
    } catch (err) {
      setError("Error connecting to the API.");
    }
  };

  // Build the label for the input field based on mode.
  const buildLabel = () => {
    if (isReverse) {
      return limitlessMode 
        ? (
          <span>
            Enter a Roman numeral. Use this mapping for{" "}
            <a 
              href="https://en.wikipedia.org/wiki/Vinculum_(symbol)" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              vinculum
            </a>
            : _I: {"I\u0305"}, _V: {"V\u0305"}, _X: {"X\u0305"}, _L: {"L\u0305"}, _C: {"C\u0305"}, _D: {"D\u0305"}, _M: {"M\u0305"}
          </span>
        )
        : (
          <span>
            Enter a <a 
              href="https://www.romannumerals.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              Roman numeral
            </a> to convert
          </span>
        );
    } else {
      return (
        <span>
          Enter a number (
          <a 
            href={
              limitlessMode 
                ? "https://en.wikipedia.org/wiki/Vinculum_(symbol)" 
                : "https://www.romannumerals.org/"
            }
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            {limitlessMode ? "1-3999999" : "1-3999"}
          </a>
          )
        </span>
      );
    }
  };

  // Build the error message display.
  const renderError = () => {
    const parsedInput = parseInt(inputValue, 10);
    // Only show the unlock if in default mode and input is actually out-of-range.
    if (!limitlessMode && !isReverse && error === "Input must be between 1 and 3999") {
      return (
        <p style={{ color: 'red' }}>
          Input must be between 1 and 3999.{" "}
          <a 
            href="#"
            onClick={(e) => { 
              e.preventDefault(); 
              setLimitlessMode(true); 
              setError(""); // Clear the old error
            }}
            style={{ textDecoration: 'underline', color: colorScheme === 'dark' ? 'orange' : 'blue' }}
          >
            Unlock range w/ vinculum?
          </a>
        </p>
      );
    }
    // Safeguard, branch should not be reached
    if (limitlessMode && !isReverse && error === "Input must be between 1 and 3999" && parsedInput <= 3999999) {
      return null;
    }
    return error && <p style={{ color: 'red' }}>{error}</p>;
  };

  return (
    <Provider theme={defaultTheme} colorScheme={colorScheme}>
      <View padding="size-400">
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap="size-200"
          minHeight="100vh"
        >
          <h1>Roman Numeral Converter</h1>
          <Button variant="secondary" onPress={toggleColorScheme}>
            Toggle {colorScheme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
          <Button variant="secondary" onPress={toggleConversionMode}>
            Switch to {isReverse ? 'Number-to-Roman' : 'Roman-to-Number'} Mode
          </Button>
          <TextField 
            label={buildLabel()}
            type={!isReverse ? "number" : "text"}
            {...(!isReverse ? ({ UNSAFE_inputAttributes: { step: 1 } } as any) : {})}
            value={inputValue}
            onChange={(value) => {
              if (isReverse) {
                if (limitlessMode) {
                  const sanitized = value.replace(/[^IVXLCDM_ivxlcdm]/g, '').toUpperCase();
                  setInputValue(sanitized);
                } else {
                  const sanitized = value.replace(/[^IVXLCDMivxlcdm]/g, '').toUpperCase();
                  setInputValue(sanitized);
                }
              } else {
                const sanitized = value.replace(/\D/g, '');
                setInputValue(sanitized);
              }
            }}
            onKeyDown={(e) => {
              if (!isReverse) {
                if (e.key.length === 1 && !/\d/.test(e.key)) {
                  e.preventDefault();
                }
              } else {
                if (!limitlessMode && e.key === '_') {
                  e.preventDefault();
                }
                if (e.key.length === 1 && !/[IVXLCDMivxlcdm_]/.test(e.key)) {
                  e.preventDefault();
                }
              }
            }}
            width="size-2400"
          />
          <Button 
            variant="cta" 
            onPress={handleConvert}
            UNSAFE_style={ colorScheme === 'dark' ? { backgroundColor: 'orange', color: 'black' } : {} }
          >
            Convert
          </Button>
          {renderError()}
          {result && (
            <p>
              <strong>
                {isReverse ? 'Converted Number:' : 'Roman Numeral:'}
              </strong>{" "}
              {isReverse 
                ? (Number(result) > 9999 
                    ? Number(result).toLocaleString("en-US") 
                    : result)
                : ((limitlessMode) ? formatRomanVinculum(result) : result)}
            </p>
          )}
        </Flex>
      </View>
    </Provider>
  );
};

export default App;