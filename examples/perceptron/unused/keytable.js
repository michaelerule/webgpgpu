
    // Add (experimental) key event listener
    document.onkeypress = function(e) {
        var k = (e.which) ? e.which : e.keyCode;
        console.log('Key pressed: '+k);
        // Common key codes (not exclusive)
        // # denotes numeric keypad codes (distinct from numbers in a row
        // above QWERTY
        switch (k) {
            case  8: /*BACKSP*/ break;
            case  9: /*TAB*/ break;
            case 13: /*ENTER*/ break;
            case 16: /*SHFT*/ break;
            case 17: /*CTRL*/ break;
            case 18: /*ALT*/ break;
            case 19: /*PAUSE*/ break;
            case 20: /*CAPS*/ break;
            case 27: /*ESC*/ break;
            case 32: /*SPACE*/ break;
            case 33: /*PGUP*/ break;
            case 34: /*PGDOWN*/ break;
            case 35: /*END*/ break;
            case 36: /*HOME*/ break;
            case 37: /*LEFT*/ break;
            case 38: /*RIGHT*/ break;
            case 39: /*UP*/ break;
            case 40: /*DOWN*/ break;
            case 42: /*PRINTSC*/ break;
            case 45: /*INS*/ break;
            case 46: /*DEL*/ break;
            case 91: /*LEFTWIN*/ break;
            case 92: /*RIGHTWIN*/ break;
            case 93: /*SELECT*/ break;
            case 144: /*NUMLOCK*/ break;
            case 145: /*SCROLLLOCK*/ break;

            case 126: /*~*/ break;
            case 33: /*!*/ break;
            case 64: /*@*/ break;
            case 35: /*#*/ break;
            case 36: /*$*/ break;
            case 37: /*%*/ break;
            case 94: /*^*/ break;
            case 38: /*&*/ break;
            case 42: /***/ break;
            case 106: /*#**/ break;
            case 40: /*(*/ break;
            case 41: /*)*/ break;
            case 95: /*_*/ break;
            case 43: /*+*/ break;
            case 107: /*#+*/ break;

            case 161: /*¡*/ break;
            case 8482: /*™*/ break;
            case 163: /*£*/ break;
            case 162: /*¢*/ break;
            case 8734: /*∞*/ break;
            case 167: /*§*/ break;
            case 182: /*¶*/ break;
            case 8226: /*•*/ break;
            case 170: /*ª*/ break;
            case 186: /*º*/ break;
            case 8211: /*–*/ break;
            case 8800: /*≠*/ break;

            case 48: /*0*/ break;
            case 96: /*#0*/ break;
            case 49: /*1*/ break;
            case 97: /*#1*/ break;
            case 50: /*2*/ break;
            case 98: /*#2*/ break;
            case 51: /*3*/ break;
            case 99: /*#3*/ break;
            case 52: /*4*/ break;
            case 100: /*#4*/ break;
            case 53: /*5*/ break;
            case 101: /*#5*/ break;
            case 54: /*6*/ break;
            case 102: /*#6*/ break;
            case 55: /*7*/ break;
            case 103: /*#7*/ break;
            case 56: /*8*/ break;
            case 104: /*#8*/ break;
            case 57: /*9*/ break;
            case 105: /*#9*/ break;

            case 65: /*A*/ break;
            case 66: /*B*/ break;
            case 67: /*C*/ break;
            case 68: /*D*/ break;
            case 69: /*E*/ break;
            case 70: /*F*/ break;
            case 71: /*G*/ break;
            case 72: /*H*/ break;
            case 73: /*I*/ break;
            case 74: /*J*/ break;
            case 75: /*K*/ break;
            case 76: /*L*/ break;
            case 77: /*M*/ break;
            case 78: /*N*/ break;
            case 79: /*O*/ break;
            case 80: /*P*/ break;
            case 81: /*Q*/ break;
            case 82: /*R*/ break;
            case 83: /*S*/ break;
            case 84: /*T*/ break;
            case 85: /*U*/ break;
            case 86: /*V*/ break;
            case 87: /*W*/ break;
            case 88: /*X*/ break;
            case 89: /*Y*/ break;
            case 90: /*Z*/ break;

            case 112: /*F1*/ break;
            case 113: /*F2*/ break;
            case 114: /*F3*/ break;
            case 115: /*F4*/ break;
            case 116: /*F5*/ break;
            case 117: /*F6*/ break;
            case 118: /*F7*/ break;
            case 119: /*F8*/ break;
            case 120: /*F9*/ break;
            case 121: /*F10*/ break;
            case 122: /*F11*/ break;
            case 123: /*F12*/ break;

            case 186: /*;*/ break;
            case 187: /*=*/ break;
            case 188: /*,*/ break;
            case 189: /*-*/ break;
            case 108: /*#-*/ break;
            case 190: /*.*/ break;
            case 109: /*#.*/ break;
            case 191: /*/*/ break;
            case 110: /*#/*/ break;
            case 192: /*\*/ break;
            case 193: /*`*/ break;
            case 194: /*[*/ break;
            case 195: /*]*/ break;
            case 196: /*'*/ break;
            
            // OSX can generate many more key-typed events
            // including combinind modifiers, etc. 
            // they are not documented here. 
        }
    };
