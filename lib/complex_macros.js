

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
#define sinh(x) ((exp(x)-exp(-x))*0.5)
#define cosh(x) ((exp(x)+exp(-x))*0.5)
#define tanh(x) ((exp(2.0*(x))-1)/(exp(2.0*(x))+1))
#define coth(x) ((exp(2.0*(x))+1)/(exp(2.0*(x))-1))
#define sech(x) (1.0/cosh(x))
#define csch(x) (1.0/sinh(x))

////////////////////////////////////////////////////
// Macros for complex arithmetic with webGL vectors

// Complex addition
// q+p: already implemented as vector addition in WebGL

// Complex multiplication
// q*p = (a+bi)(c+di) = ac + bci + adi -bd
#define cmul(p,q) vec2((q).x*(p).x-(q).y*(p).y,(q).x*(p).y+(q).y*(p).x)

// Complex conjugate
#define conj(p) vec2((p).x,-(p).y)

// Small hack to work around the parser
// The complex expression parser replaces operators / functions
// with the macro names here by just prepending "c" to the function name
// this works with almost everuything, except conjugate, which is already
// only defined for complex. Meh.. this is a lazy workaround. 
#define cconj conj
#define csqrt(p) cpow(p,vec2(0.5,0))
#define carg(p) vec2(atan((p).y,(p).x),0)

// Magnitude squared 
#define magsq(x) (dot((x),(x)))

// Absolute magnitude
#define cabs(x) (vec2(length(x),0))

// Complex reciprocal
// 1/p = 1/(a+bi) = (a-bi)/(a*a+b*b)
#define crec(p) (conj(p)/magsq(p))

// Complex multiply-by-i (rotate 90 degrees)
// ip = i(a+bi) = ia-b
#define ci(p) vec2(-(p).y,(p).x)

// Complex division
// q/p = (a+bi)/(c+di) = (a+bi)(c-di)/(c*c+d*d) 
#define cdiv(p,q) (cmul(p,conj(q))/magsq(q))

// Complex logarithm (converts cartesian to log-polar coordinates)
// ln(re^iθ) = ln(r) + iθ
#define clog(p) vec2(log(length(p)),atan((p).y,(p).x))

// Complex unit vector at angle h
// e^ih = cos(h) + i sin(h)
#define cunit(h) vec2(cos(h),sin(h))

// Complex exponential (converts log-polar to cartesian coordinates)
// e^(a+bi) = e^a e^(bi) = e^a (cos(b) + i sin(b)) 
#define cexp(p) (cunit((p).y)*exp((p).x))

// Complex power
// p^q = exp(log(p^q))= exp(q*log(p))
#define cpow(p,q) cexp(cmul(q,clog(p)))

// Complex cosine
// cos(p) = cos(a+bi) = cos(a)cos(bi) - sin(a)sin(bi)
// = cos(a)cosh(b) - i sin(a)sinh(b)
#define ccos(p) vec2(cos((p).x)*cosh((p).y),-sin((p).x)*sinh((p).y))

// Complex sine
// (similar to cosine)
#define csin(p) vec2(sin((p).x)*cosh((p).y),cos((p).x)*sinh((p).y))

// Complex tangent and other trig functions, naively implemented
#define ctan(p)  cdiv(csin(p),ccos(p))
#define ccot(p)  cdiv(ccos(p),csin(p))
#define csec(p)  crec(ccos(p))
#define ccsc(p)  crec(csin(p))
#define csinh(p) (-1.0*ci(csin(ci(p))))
#define ccosh(p) ccos(ci(p))
#define ctanh(p) (-1.0*ci(ctan(ci(p))))
#define ccoth(p) ci(ccot(ci(p)))
#define csech(p) csec(ci(p))
#define ccsch(p) ci(ccsc(ci(p)))
`









