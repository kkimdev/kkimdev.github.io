"use strict";(self.webpackChunkkkimdev=self.webpackChunkkkimdev||[]).push([[593],{7351:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>o,default:()=>p,frontMatter:()=>a,metadata:()=>r,toc:()=>c});var i=n(1527),s=n(6274);const a={draft:!1,title:"IEEE 754 Floating Point Type in C++",authors:"kkimdev"},o=void 0,r={permalink:"/blog/2018/06/15/IEEE-754-Floating-Point-Type-in-C++",source:"@site/blog/2018-06-15-IEEE-754-Floating-Point-Type-in-C++.md",title:"IEEE 754 Floating Point Type in C++",description:"Let's say we want to use IEEE 754 32/64bit floating point types in C++, then",date:"2018-06-15T00:00:00.000Z",formattedDate:"June 15, 2018",tags:[],readingTime:7.14,hasTruncateMarker:!0,authors:[{name:"Kibeom Kim",url:"/",imageURL:"https://github.com/kkimdev.png",key:"kkimdev"}],frontMatter:{draft:!1,title:"IEEE 754 Floating Point Type in C++",authors:"kkimdev"},unlisted:!1,prevItem:{title:"Rust - Compile Time Memory Safety",permalink:"/blog/2019/04/22/Rust-Compile-Time-Memory-Safety"}},d={authorsImageUrls:[void 0]},c=[];function l(e){const t={a:"a",blockquote:"blockquote",code:"code",p:"p",pre:"pre",strong:"strong",...(0,s.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(t.p,{children:["Let's say we want to use IEEE 754 32/64bit floating point types in C++, then\nthere is ",(0,i.jsx)(t.code,{children:"float"})," and ",(0,i.jsx)(t.code,{children:"double"})," right? Unfortunately, C++ standard guarantees\nalmost nothing about the built-in floating point types."]}),"\n",(0,i.jsxs)(t.blockquote,{children:["\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.a,{href:"http://eel.is/c++draft/basic.fundamental#8",children:"\xa7 6.7.1.8"})," There are three\nfloating-point types: float, double, and long double. The type double provides\nat least as much precision as float, and the type long double provides at\nleast as much precision as double. The set of values of the type float is a\nsubset of the set of values of the type double; the set of values of the type\ndouble is a subset of the set of values of the type long double. ",(0,i.jsx)(t.strong,{children:"The value\nrepresentation of floating-point types is implementation-defined"}),". ..."]}),"\n"]}),"\n",(0,i.jsxs)(t.p,{children:["So are we just doomed? No! There is\n",(0,i.jsx)(t.a,{href:"http://en.cppreference.com/w/cpp/types/numeric_limits",children:"std::numeric_limits"}),"\nthat gives various floating point type trait information, and neat C++ compile\ntime tricks we can use to craft a clean type API. So let's try. The goal is to\nconstruct the following IEEE754 floating point types."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-cpp",children:'#include <iostream>\n#include "ieee754_types.hpp"\n\nint main() {\n  IEEE_754_2008_Binary<32> x = 1.0;\n  IEEE_754_2008_Binary<64> y = 2.0;\n\n  std::cout << x + y << std::endl;\n\n  // Compile time error if the requested type doesn\'t exist in the system.\n  // IEEE_754_2008_Binary<16> z;\n}\n'})}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.code,{children:"IEEE_754_2008_Binary<n>"})," is n-bit IEEE 754 floating point type. Of course, for\nmost systems, ",(0,i.jsx)(t.code,{children:"IEEE_754_2008_Binary<32>"})," is ",(0,i.jsx)(t.code,{children:"float"})," and\n",(0,i.jsx)(t.code,{children:"IEEE_754_2008_Binary<64>"})," is ",(0,i.jsx)(t.code,{children:"double"}),". In case the requested type is not\navailable, like ",(0,i.jsx)(t.code,{children:"IEEE_754_2008_Binary<16>"}),", it should cause a compile error with\na clear error message."]}),"\n",(0,i.jsxs)(t.p,{children:["Well, I guess a natural question at this point is: \"Do we really need this?\nCan't we just assume ",(0,i.jsx)(t.code,{children:"float"})," and ",(0,i.jsx)(t.code,{children:"double"})," are IEEE 754 because they actually are\nfor the 99.9% systems out there?\". I thought so, but then later, I've found that\npeople have submitted related proposals,\n",(0,i.jsx)(t.a,{href:"http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1703.pdf",children:"N1703"}),",\n",(0,i.jsx)(t.a,{href:"http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2013/n3626.pdf",children:"N3626"}),", to\nC/C++ standards committee to fix this issue with additional standard types,\n",(0,i.jsx)(t.code,{children:"float16_t"}),", ",(0,i.jsx)(t.code,{children:"float32_t"}),", ",(0,i.jsx)(t.code,{children:"float64_t"}),", and ",(0,i.jsx)(t.code,{children:"float128_t"}),". So maybe it's not\nentirely pointless after all. Anyways, let's get started."]}),"\n",(0,i.jsxs)(t.p,{children:["First, let's begin with checking if a given type, ",(0,i.jsx)(t.code,{children:"T"}),", fulfills IEEE 754 and\nother desired conditions."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-cpp",children:"template <int storage_bits, int exponent_bits, int mantissa_bits>\nstruct Is_Ieee754_2008_Binary_Interchange_Format {\n  template <typename T>\n  static constexpr bool value =\n      ::std::is_floating_point<T>()            &&\n      ::std::numeric_limits<T>::is_iec559      &&\n      ::std::numeric_limits<T>::radix == 2     &&\n      get_storage_bits<T>() == storage_bits    &&\n      get_exponent_bits<T>() == exponent_bits  &&\n      get_mantissa_bits<T>() == mantissa_bits;\n};\n"})}),"\n",(0,i.jsxs)(t.p,{children:["We used\n",(0,i.jsx)(t.a,{href:"https://en.cppreference.com/w/cpp/language/variable_template",children:"variable template"}),"\nfor the type dependent boolean value computation, and also wrapped by a template\nstruct so that we can pass it around easily as a type template parameter later."]}),"\n",(0,i.jsxs)(t.p,{children:["First, we check if ",(0,i.jsx)(t.code,{children:"T"})," compiles IEEE 754 (equivalently,\n",(0,i.jsx)(t.a,{href:"https://www.iso.org/standard/57469.html",children:"IEC 60559"}),") with\n",(0,i.jsx)(t.a,{href:"https://en.cppreference.com/w/cpp/types/numeric_limits/is_iec559",children:(0,i.jsx)(t.code,{children:"std::is_iec559"})}),".\nWe should also check ",(0,i.jsx)(t.code,{children:"radix == 2"})," since IEEE 754 defines two types of floating\npoints, binary and decimal. Finally, we check if ",(0,i.jsx)(t.code,{children:"T"})," has the requested number of\nstorage(width), exponent, and mantissa bits. IEEE 754 defines the standard\nnumber of exponent and mantissa bits for certain sizes, 16, 32, 64, 128, 160,\n..., but it also allows implementations to have arbitrary sizes and bits (e.g.,\n",(0,i.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Extended_precision#x86_extended_precision_format",children:"x86 extended precision format"}),"),\nso we need to check that if ",(0,i.jsx)(t.code,{children:"T"})," has the exact format we want."]}),"\n",(0,i.jsxs)(t.p,{children:["We can calculate the number of bits of ",(0,i.jsx)(t.code,{children:"T"})," with the following simple compile\ntime functions."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-cpp",children:"template <typename T>\nconstexpr int get_storage_bits() {\n  return sizeof(T) * CHAR_BIT;\n}\n\ntemplate <typename T>\nconstexpr int get_exponent_bits() {\n  int exponent_range = ::std::numeric_limits<T>::max_exponent -\n                       ::std::numeric_limits<T>::min_exponent;\n  int bits = 0;\n  while ((exponent_range >> bits) > 0) ++bits;\n  return bits;\n}\n\ntemplate <typename T>\nconstexpr int get_mantissa_bits() {\n  return ::std::numeric_limits<T>::digits - 1;\n}\n"})}),"\n",(0,i.jsxs)(t.p,{children:["For the mantissa bits, the leading bit is implicit so we need to subtract 1. For\nthe exponent bits, there is no direct property available in\n",(0,i.jsx)(t.code,{children:"std::numeric_limits"})," so instead we calculate the minimum number of bits\nrequired to represent its exponent range."]}),"\n",(0,i.jsxs)(t.p,{children:["Now, we have everything needed to figure out if the given ",(0,i.jsx)(t.code,{children:"T"})," is the type we're\nlooking for. The next step is to automatically select such type among the\nbuilt-in floating point types, ",(0,i.jsx)(t.code,{children:"float"}),", ",(0,i.jsx)(t.code,{children:"double"}),", and ",(0,i.jsx)(t.code,{children:"long double"}),", given the\nsize in bits, e.g., 32, 64. This is where it gets interesting."]}),"\n",(0,i.jsxs)(t.p,{children:["The following ",(0,i.jsx)(t.code,{children:"find_type()"})," recursive function selects a type among ",(0,i.jsx)(t.code,{children:"T"})," and ",(0,i.jsx)(t.code,{children:"Ts"}),"\nthat satisfies the condition ",(0,i.jsx)(t.code,{children:"C"}),". In our case, ",(0,i.jsx)(t.code,{children:"T"})," and ",(0,i.jsx)(t.code,{children:"Ts"})," are\n",(0,i.jsx)(t.code,{children:"float, double, long double"}),", and ",(0,i.jsx)(t.code,{children:"C"})," is the struct we defined previously,\n",(0,i.jsx)(t.code,{children:"Is_Ieee754_2008_Binary_Interchange_Format<storage_bits, exponent_bits, storage_bits, mantissa_bits>"}),"."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-cpp",children:"template <typename C, typename T, typename... Ts>\nconstexpr auto find_type() {\n  throw;\n\n  if constexpr (C::template value<T>) {\n    return T();\n  } else if constexpr (sizeof...(Ts) >= 1) {\n    return find_type<C, Ts...>();\n  } else {\n    return void();\n  }\n}\n"})}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.code,{children:"typename... Ts"})," is a\n",(0,i.jsx)(t.a,{href:"https://en.cppreference.com/w/cpp/language/parameter_pack",children:"parameter pack"})," that\ncan match any number of types. So ",(0,i.jsx)(t.code,{children:"T"})," will be ",(0,i.jsx)(t.code,{children:"float"})," and ",(0,i.jsx)(t.code,{children:"Ts"})," will be\n",(0,i.jsx)(t.code,{children:"double, long double"}),". The first if condition, ",(0,i.jsx)(t.code,{children:"C::template value<T>"})," checks if\n",(0,i.jsx)(t.code,{children:"T"})," satisfies the condition given by ",(0,i.jsx)(t.code,{children:"C"}),", if so, it returns a default instance\nof ",(0,i.jsx)(t.code,{children:"T"}),". The second if condition, ",(0,i.jsx)(t.code,{children:"sizeof...(Ts) >= 1"}),", checks if there are more\ntypes in ",(0,i.jsx)(t.code,{children:"Ts"})," to exam, if so, it recursively calls itself, ",(0,i.jsx)(t.code,{children:"find_type()"}),", with\n",(0,i.jsx)(t.code,{children:"Ts"})," to continue the search. Finally, if there is nothing in ",(0,i.jsx)(t.code,{children:"Ts"}),", it returns a\nvoid instance."]}),"\n",(0,i.jsxs)(t.p,{children:["Note that since the return type of ",(0,i.jsx)(t.code,{children:"find_type()"})," is ",(0,i.jsx)(t.code,{children:"auto"}),", the return type will\nbe deduced to what ",(0,i.jsx)(t.code,{children:"find_type()"})," returns at compile time. In addition,\n",(0,i.jsx)(t.a,{href:"http://en.cppreference.com/w/cpp/language/if#Constexpr_If",children:(0,i.jsx)(t.code,{children:"if constexpr"})}),"\ndiscards the unused conditional paths at compile time, so even though\n",(0,i.jsx)(t.code,{children:"find_type()"})," has multiple return statements with different types, it compiles\nsuccessfully."]}),"\n",(0,i.jsxs)(t.p,{children:["Since ",(0,i.jsx)(t.code,{children:"find_type()"}),"'s return type is what we need, we can do\n",(0,i.jsx)(t.code,{children:"decltype(find_type<...>())"})," to get that. The statement ",(0,i.jsx)(t.code,{children:"throw;"})," at the first\nline of ",(0,i.jsx)(t.code,{children:"find_type()"})," is not necessary but it's there to indicate that\n",(0,i.jsx)(t.code,{children:"find_type()"})," is not supposed to be called directly."]}),"\n",(0,i.jsxs)(t.p,{children:["The following code defines ",(0,i.jsx)(t.code,{children:"BinaryFloatOrVoid"})," type using\n",(0,i.jsx)(t.code,{children:"decltype(find_type<...>())"}),". The newly defined type, ",(0,i.jsx)(t.code,{children:"BinaryFloatOrVoid"}),", will\nbe a IEEE754 floating point type that matches the given storage, exponent, and\nmantissa bits, or ",(0,i.jsx)(t.code,{children:"void"})," if the search fails."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-cpp",children:"\ntemplate <int storage_bits,\n          int exponent_bits =\n              standard_binary_interchange_format_exponent_bits<storage_bits>(),\n          int mantissa_bits =\n              standard_binary_interchange_format_mantissa_bits<storage_bits>()>\nusing BinaryFloatOrVoid =\n    decltype(find_type<                                                //\n             Is_Ieee754_2008_Binary_Interchange_Format<storage_bits,   //\n                                                       exponent_bits,  //\n                                                       mantissa_bits>,\n             float, double, long double>());\n"})}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.code,{children:"standard_binary_interchange_format_exponent_bits()"})," and\n",(0,i.jsx)(t.code,{children:"standard_binary_interchange_format_mantissa_bits()"})," functions just return the\nnumber of standard exponent and mantissa bits respectively, and we set them as\nthe default values for ",(0,i.jsx)(t.code,{children:"exponent_bits"})," and ",(0,i.jsx)(t.code,{children:"mantissa_bits"})," for convenience. I\nwill omit their actual implementations as it's pretty straightforward and\nuninteresting."]}),"\n",(0,i.jsxs)(t.p,{children:["Traditionally, before ",(0,i.jsx)(t.code,{children:"if constexpr"})," was available in C++17, this kind of\ncompile time type manipulation was implemented with\n",(0,i.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Substitution_failure_is_not_an_error",children:"SFINAE"}),".\nThe following code shows how it can be done in that way."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-cpp",children:"// Recursion termination.  Type not found.\ntemplate <typename C, typename... Ts>\nstruct FindType {\n  using type = void;\n};\n\n// Recursion\ntemplate <typename C, typename T, typename... Ts>\nstruct FindType<C, T, Ts...> {\n  // Set `type = T` if T satisfies the condition, C.  Otherwise, keep\n  // searching in the remaining types, Ts... .\n  using type = ::std::conditional_t<  //\n      C::template value<T>, T, typename FindType<C, Ts...>::type>;\n};\n\ntemplate <int storage_bits,\n          int exponent_bits =\n              standard_binary_interchange_format_exponent_bits<storage_bits>(),\n          int mantissa_bits =\n              standard_binary_interchange_format_mantissa_bits<storage_bits>()>\nusing BinaryFloatOrVoid = typename FindType<                  //\n    Is_Ieee754_2008_Binary_Interchange_Format<storage_bits,   //\n                                              exponent_bits,  //\n                                              mantissa_bits>,\n    float, double, long double>::type;\n"})}),"\n",(0,i.jsxs)(t.p,{children:["Clearly, the ",(0,i.jsx)(t.code,{children:"if constexpr"})," version is simpler and a lot more readable, and I\nexpect to see less of the SFINAE mess thanks to ",(0,i.jsx)(t.code,{children:"if constexpr"})," (and hopefully\n",(0,i.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Concepts_(C%2B%2B)",children:"concepts"}),") in the future."]}),"\n",(0,i.jsxs)(t.p,{children:["Lastly, we introduce another type layer to cause a compile error with a nice\nerror message, in case the requested type is not available, i.e.,\n",(0,i.jsx)(t.code,{children:"BinaryFloatOrVoid"})," is ",(0,i.jsx)(t.code,{children:"void"}),"."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-cpp",children:'template <typename T>\nstruct AssertTypeFound {\n  static_assert(\n      !::std::is_same_v<T, void>,\n      "No corresponding IEEE 754-2008 binary interchange format found.");\n  using type = T;\n};\n\ntemplate <int storage_bits>\nusing IEEE_754_2008_Binary = typename AssertTypeFound<\n    BinaryFloatOrVoid<storage_bits>>::type;\n'})}),"\n",(0,i.jsxs)(t.p,{children:["OK, finally, we have constructed the type ",(0,i.jsx)(t.code,{children:"IEEE_754_2008_Binary<n>"})," that\nguarantees IEEE 754 standard binary interchange format. Yay!"]}),"\n",(0,i.jsx)(t.p,{children:"So are we done now? Not quite, there is one last step that every programmer\nloves: writing tests. :)"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-cpp",children:'template <int storage_bits, int exponent_bits, int mantissa_bits>\nvoid test_if_type_exists() {\n  throw;\n\n  if constexpr (!::std::is_same_v<BinaryFloatOrVoid<storage_bits>, void>) {\n    using T = IEEE_754_2008_Binary<storage_bits>;\n    static_assert(::std::is_floating_point<T>(), "");\n    static_assert(::std::numeric_limits<T>::is_iec559, "");\n    static_assert(::std::numeric_limits<T>::radix == 2, "");\n    static_assert(get_storage_bits<T>() == storage_bits, "");\n    static_assert(get_exponent_bits<T>() == exponent_bits, "");\n    static_assert(get_mantissa_bits<T>() == mantissa_bits, "");\n  }\n}\n\nvoid tests() {\n  throw;\n\n  test_if_type_exists<16, 5, 10>();\n  test_if_type_exists<32, 8, 23>();\n  test_if_type_exists<64, 11, 52>();\n  test_if_type_exists<128, 15, 112>();\n}\n'})}),"\n",(0,i.jsxs)(t.p,{children:["Again, all the checks are done at compile time, ",(0,i.jsx)(t.code,{children:"static_assert"}),", so we don't\nneed to call ",(0,i.jsx)(t.code,{children:"test()"}),", and just have to ensure that ",(0,i.jsx)(t.code,{children:"test_if_type_exists"}),"\nfunctions are instantiated. If a type doesn't exists (i.e., 16 and 128 size\ntypes in most systems) then ",(0,i.jsx)(t.code,{children:"if constexpr"})," will simply discard the checks."]}),"\n",(0,i.jsxs)(t.p,{children:["I hope you had fun, like I did. The full implementation is available in this\nrepository ",(0,i.jsx)(t.a,{href:"https://github.com/kkimdev/ieee754-types",children:"https://github.com/kkimdev/ieee754-types"}),"."]})]})}function p(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}}}]);