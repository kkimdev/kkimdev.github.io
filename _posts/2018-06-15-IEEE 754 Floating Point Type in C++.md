---
title: "IEEE 754 Floating Point Type in C++"
redirect_from:
  - /posts/2018/06/15/C++-IEEE-754-floating-point-type-Overengineering-Series-1.html
  - /posts/2018/06/15/IEEE-754-Floating-Point-Type-in-C++-Overengineering-Series-1.html
---
Let's say we want to use IEEE 754 32/64bit floating point types in C++, then there is `float` and `double` right?  Unfortunately, C++ standard guarantees almost nothing about the built-in floating point types.

```c++
void f() {

}
```

`void f()`{:.language=c++}

<span style="font-family:'Material Icons'">open_in_new</span>
> [§ 6.7.1.8 ](http://eel.is/c++draft/basic.fundamental#8){:target="_blank"} There are three floating-point types: float, double, and long double. The type double provides at least as much precision as float, and the type long double provides at least as much precision as double. The set of values of the type float is a subset of the set of values of the type double; the set of values of the type double is a subset of the set of values of the type long double. **The value representation of floating-point types is implementation-defined**. ...

So are we just doomed? No! There is [std::numeric_limits](http://en.cppreference.com/w/cpp/types/numeric_limits) that gives various floating point type trait information, and neat C++ compile time tricks we can use to craft a clean type API. So let's try. The goal is to construct the following IEEE754 floating point types.

```c++
#include <iostream>
#include "ieee754_types.hpp"

int main() {
  IEEE_754_2008_Binary<32> x = 1.0;
  IEEE_754_2008_Binary<64> y = 2.0;

  std::cout << x + y << std::endl;

  // Compile time error if the requested type doesn't exist in the system.
  // IEEE_754_2008_Binary<16> z;
}
```

`IEEE_754_2008_Binary<n>` is n-bit IEEE 754 floating point type. Of course, for most systems, `IEEE_754_2008_Binary<32>` is `float` and `IEEE_754_2008_Binary<64>` is `double`.  In case the requested type is not available, like `IEEE_754_2008_Binary<16>`, it should cause a compile error with a clear error message.

Well, I guess a natural question at this point is: "Do we really need this? Can't we just assume `float` and `double` are IEEE 754 because they actually are for the 99.9% systems out there?". I thought so, but then later, I've found that people have submitted related proposals, [N1703](http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1703.pdf), [N3626](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2013/n3626.pdf), to C/C++ standards committes to fix this issue with additional standard types, `float16_t`, `float32_t`, `float64_t`, and `float128_t`. So maybe it's not entirely pointless afterall.  Anyways, let's get started.

First, let's check if a given type, `T`, satisfies the IEEE 754 floating point requirements and other desired conditions.

```c++
template <int storage_bits, int exponent_bits, int mantissa_bits>
struct Is_Ieee754_2008_Binary_Interchange_Format {
  template <typename T>
  static constexpr bool value =
      ::std::is_floating_point<T>()            &&
      ::std::numeric_limits<T>::is_iec559      &&
      ::std::numeric_limits<T>::radix == 2     &&
      get_storage_bits<T>() == storage_bits    &&
      get_exponent_bits<T>() == exponent_bits  &&
      get_mantissa_bits<T>() == mantissa_bits;
};
```

We used [variable template](https://en.cppreference.com/w/cpp/language/variable_template) for the type dependent boolean value computation, and also wrapped by a template struct so that we can pass it around easily as a type template parameter later.

First, we check if `T` meets the requirements of IEEE 754 (equivalently, IEC 60559) with [`std::is_iec559`](https://en.cppreference.com/w/cpp/types/numeric_limits/is_iec559).  We should also check `radix == 2` since IEEE 754 defines two types of floating points, binary and decimal. Finally, we check if `T` has the requested number of storage(width), exponent, and mantissa bits. IEEE 754 defines the standard number of exponent and mantissa bits for certain sizes, 16, 32, 64, 128, 160, ..., but it also allows implementations to have arbitrary sizes and bits (e.g., [x86 extended precision format](https://en.wikipedia.org/wiki/Extended_precision#x86_extended_precision_format)), so we need to check that if `T` has the exact format we want.

We can calculate the number of bits of `T` with the following simple compile time functions.

```c++
template <typename T>
constexpr int get_storage_bits() {
  return sizeof(T) * CHAR_BIT;
}

template <typename T>
constexpr int get_exponent_bits() {
  int exponent_range = ::std::numeric_limits<T>::max_exponent -
                       ::std::numeric_limits<T>::min_exponent;
  int bits = 0;
  while ((exponent_range >> bits) > 0) ++bits;
  return bits;
}

template <typename T>
constexpr int get_mantissa_bits() {
  return ::std::numeric_limits<T>::digits - 1;
}
```

For the mantissa bits, the leading bit is implicit so we need to subtract 1.  For the exponent bits, there is no direct property available in `std::numeric_limits` so instead we calculate the minimum number of bits required to represent its exponent range.

Now, we have everything needed to figure out if the given `T` is the type we're looking for.  The next step is to automatically select such type among the built-in floating point types, `float`, `double`, and `long double`, given the size in bits, e.g., 32, 64. This is where it gets interesting.

The following `find_type()` recursive function selects a type among `T` and `Ts` that satisfies the condition `C`. In our case, `T` and `Ts` are `float, double, long double`, and `C` is the struct we defined before, `Is_Ieee754_2008_Binary_Interchange_Format<storage_bits, exponent_bits, storage_bits, mantissa_bits>`.

```c++
template <typename C, typename T, typename... Ts>
constexpr auto find_type() {
  throw;

  if constexpr (C::template value<T>) {
    return T();
  } else if constexpr (sizeof...(Ts) >= 1) {
    return find_type<C, Ts...>();
  } else {
    return void();
  }
}
```

`typename... Ts` is a [parameter pack](https://en.cppreference.com/w/cpp/language/parameter_pack) that can match any number of types. So `T` will be `float` and `Ts` will be `double, long double`. The first if condition, `C::template value<T>` checks if `T` satisfies the condition given by `C`, if so, it returns a default instance of `T`.  The second if condition, `sizeof...(Ts) >= 1`, checks if there are more types in `Ts` to exam, if so, it recursively calls itself, `find_function()`, with `Ts` to continue the search. Finally, if there is nothing in `Ts`, it returns a void instance.

Note that since the return type of `find_type()` is `auto`, the return type will be deduced to what `find_type()` returns at compile time. In addition, [`if constexpr`](http://en.cppreference.com/w/cpp/language/if#Constexpr_If) discards the unused conditional paths at compile time, so even though `find_type()` has multiple return statements with different types, it compiles successfully.

Since `find_type()`'s return type is what we need, we can do `decltype(find_type<...>())` to get that. The statement `throw;` at the first line of `find_type()` is not necessary but it's there to indicate that `find_type()` is not supposed to be called directly.

The following code defines `BinaryFloatOrVoid` type using `decltype(find_type<...>())`. The newly defined type, `BinaryFloatOrVoid`, will be a IEEE754 floating point type that matches the given storage, exponent, and mantissa bits, or `void` if the search fails.

```c++

template <int storage_bits,
          int exponent_bits =
              standard_binary_interchange_format_exponent_bits<storage_bits>(),
          int mantissa_bits =
              standard_binary_interchange_format_mantissa_bits<storage_bits>()>
using BinaryFloatOrVoid =
    decltype(find_type<                                                //
             Is_Ieee754_2008_Binary_Interchange_Format<storage_bits,   //
                                                       exponent_bits,  //
                                                       mantissa_bits>,
             float, double, long double>());
```

`standard_binary_interchange_format_exponent_bits()` and `standard_binary_interchange_format_mantissa_bits()` functions just return the number of standard exponent and mantissa bits respectively, and we set them as the default values for `exponent_bits` and `mantissa_bits` for convinience. I will omit their actual implementations as it's pretty straightfoward and uninteresting.

Traditionally, before `if constexpr` was available in C++17, this kind of compile time type manipulation was implemented with [SFINAE](https://en.wikipedia.org/wiki/Substitution_failure_is_not_an_error). The following code shows how it can be done in that way.

```c++
// Recursion termination.  Type not found.
template <typename C, typename... Ts>
struct FindType {
  using type = void;
};

// Recursion
template <typename C, typename T, typename... Ts>
struct FindType<C, T, Ts...> {
  // Set `type = T` if T satisfies the condition, C.  Otherwise, keep
  // searching in the remaining types, Ts... .
  using type = ::std::conditional_t<  //
      C::template value<T>, T, typename FindType<C, Ts...>::type>;
};

template <int storage_bits,
          int exponent_bits =
              standard_binary_interchange_format_exponent_bits<storage_bits>(),
          int mantissa_bits =
              standard_binary_interchange_format_mantissa_bits<storage_bits>()>
using BinaryFloatOrVoid = typename FindType<                  //
    Is_Ieee754_2008_Binary_Interchange_Format<storage_bits,   //
                                              exponent_bits,  //
                                              mantissa_bits>,
    float, double, long double>::type;
```

Clearly, the `if constexpr` version is simpler and a lot more readable, and I expect to see less of the SFINAE mess thanks to `if constexpr` (and hopefully [concepts](https://en.wikipedia.org/wiki/Concepts_(C%2B%2B))) in the future.

Lastly, we introduce another type layer to cause a compile error with a nice error message, in case the requested type is not available, i.e., `BinaryFloatOrVoid` is `void`.

```c++
template <typename T>
struct AssertTypeFound {
  static_assert(
      !::std::is_same_v<T, void>,
      "No corresponding IEEE 754-2008 binary interchange format found.");
  using type = T;
};

template <int storage_bits>
using IEEE_754_2008_Binary = typename AssertTypeFound<
    BinaryFloatOrVoid<storage_bits>>::type;
```

OK, finally, we have constructed the type `IEEE_754_2008_Binary<n>` that guarantees IEEE 754 standard binary interchange format. Yay!

So are we done now? Not quite, there is one last step that every programmer loves: writing tests. :)

```c++
template <int storage_bits, int exponent_bits, int mantissa_bits>
void test_if_type_exists() {
  throw;

  if constexpr (!::std::is_same_v<BinaryFloatOrVoid<storage_bits>, void>) {
    using T = IEEE_754_2008_Binary<storage_bits>;
    static_assert(::std::is_floating_point<T>(), "");
    static_assert(::std::numeric_limits<T>::is_iec559, "");
    static_assert(::std::numeric_limits<T>::radix == 2, "");
    static_assert(get_storage_bits<T>() == storage_bits, "");
    static_assert(get_exponent_bits<T>() == exponent_bits, "");
    static_assert(get_mantissa_bits<T>() == mantissa_bits, "");
  }
}

void tests() {
  throw;

  test_if_type_exists<16, 5, 10>();
  test_if_type_exists<32, 8, 23>();
  test_if_type_exists<64, 11, 52>();
  test_if_type_exists<128, 15, 112>();
}
```

Again, all the checks are done at compile time, `static_assert`, so we don't need to call `test()`, and just have to ensure that `test_if_type_exists` functions are instantiated.  If a type doesn't exists (i.e., 16 and 128 size types in most systems) then `if constexpr` will simply discard the checks.

I hope you had fun, like I did. The full implementation is available in this repository <https://github.com/kkimdev/ieee754-types> .

