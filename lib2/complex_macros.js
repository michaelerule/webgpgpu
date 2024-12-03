

float16_macros = `
// macros for converting between float and vec 2
vec2 EncodeFloatXY( float v ) {
  v = clamp(v,0.0,1.0)*(255.0/256.0);
  vec2 enc = vec2(1.0, 255.0) * v;
  enc = fract(enc);
  enc -= enc.yy * vec2(1./255.,0.);
  return enc;
}
float DecodeFloatXY( vec2 xy ) {
  return dot( xy, vec2(1.,1./255.) );
}
// macros for converting between a vec2 representing a complex number
// and float4. NOTE: must clamp to (0,1) before calling this
vec4 EncodeComplexXY_ZW( vec2 z ) {
    return vec4(EncodeFloatXY(z.x),EncodeFloatXY(z.y));
}
vec2 DecodeComplexXY_ZW( vec4 z ) {
    return vec2(DecodeFloatXY(z.xy),DecodeFloatXY(z.zw));
}
`;

complex_macros = `
////////////////////////////////////////////////////
// Macros for auxiliary functions

#define sec(x)  (1.0/cos(x))
#define csc(x)  (1.0/sin(x))
#define cot(x)  (1.0/tan(x))
#define sech(x) (1.0/cosh(x))
#define csch(x) (1.0/sinh(x))

// converted to functions so that the variable gets bound and not 
// duplicated leading to subexpression explosion
float sinh(float x) {return ((exp(x)-exp(-x))*0.5);}
float cosh(float x) {return ((exp(x)+exp(-x))*0.5);}
float tanh(float x) {return ((exp(2.0*(x))-1.0)/(exp(2.0*(x))+1.0));}
float coth(float x) {return ((exp(2.0*(x))+1.0)/(exp(2.0*(x))-1.0));}

////////////////////////////////////////////////////
// Macros for complex arithmetic with webGL vectors

// Complex addition
// q+p: already implemented as vector addition in WebGL

// Complex multiplication
// q*p = (a+bi)(c+di) = ac + bci + adi -bd
vec2 cmul(vec2 p,vec2 q) {return vec2((q).x*(p).x-(q).y*(p).y,(q).x*(p).y+(q).y*(p).x);}

// Complex conjugate
vec2 conj(vec2 p) {return vec2((p).x,-(p).y);}

// Small hack to work around the parser
// The complex expression parser replaces operators / functions
// with the macro names here by just prepending "c" to the function name
// this works with almost everuything, except conjugate, which is already
// only defined for complex. Meh.. this is a lazy workaround. 
#define cconj conj
#define csqrt(p) cpow(p,vec2(0.5,0.0))
vec2 carg(vec2 p) {return vec2(atan((p).y,(p).x),0.0);}

// Magnitude squared 
float magsq(vec2 x) {return (dot((x),(x)));}

// Absolute magnitude
vec2 cabs(vec2 x) {return (vec2(length(x),0.0));}

// Complex reciprocal
// 1/p = 1/(a+bi) = (a-bi)/(a*a+b*b)
vec2 crec(vec2 p) {return (conj(p)/magsq(p));}

// Complex multiply-by-i (rotate 90 degrees)
// ip = i(a+bi) = ia-b
vec2 ci(vec2 p) {return vec2(-(p).y,(p).x);}

// Complex division
// q/p = (a+bi)/(c+di) = (a+bi)(c-di)/(c*c+d*d) 
vec2 cdiv(vec2 p,vec2 q) {return (cmul(p,conj(q))/magsq(q));}

// Complex logarithm (converts cartesian to log-polar coordinates)
// ln(re^iθ) = ln(r) + iθ
vec2 clog(vec2 p) {return vec2(log(length(p)),atan((p).y,(p).x));}

// Complex unit vector at angle h
// e^ih = cos(h) + i sin(h)
vec2 cunit(float h) {return vec2(cos(h),sin(h));}

// Complex exponential (converts log-polar to cartesian coordinates)
// e^(a+bi) = e^a e^(bi) = e^a (cos(b) + i sin(b)) 
vec2 cexp(vec2 p) {return (cunit((p).y)*exp((p).x));}

// Complex power
// p^q = exp(log(p^q))= exp(q*log(p))
vec2  cpow(vec2 p,vec2 q) {return cexp(cmul(q,clog(p)));}

// Complex cosine
// cos(p) = cos(a+bi) = cos(a)cos(bi) - sin(a)sin(bi)
// = cos(a)cosh(b) - i sin(a)sinh(b)
vec2  ccos(vec2 p) {return vec2(cos((p).x)*cosh((p).y),-sin((p).x)*sinh((p).y));}

// Complex sine
// (similar to cosine)
vec2  csin(vec2 p) {return vec2(sin((p).x)*cosh((p).y),cos((p).x)*sinh((p).y));}

// Complex tangent and other trig functions, naively implemented
vec2  ctan(vec2 p)  {return cdiv(csin(p),ccos(p));}
vec2  ccot(vec2 p)  {return cdiv(ccos(p),csin(p));}
vec2  csec(vec2 p)  {return crec(ccos(p));}
vec2  ccsc(vec2 p)  {return crec(csin(p));}
vec2  csinh(vec2 p) {return (-1.0*ci(csin(ci(p))));}
vec2  ccosh(vec2 p) {return ccos(ci(p));}
vec2  ctanh(vec2 p) {return (-1.0*ci(ctan(ci(p))));}
vec2  ccoth(vec2 p) {return ci(ccot(ci(p)));}
vec2  csech(vec2 p) {return csec(ci(p));}
vec2  ccsch(vec2 p) {return ci(ccsc(ci(p)));}
`









