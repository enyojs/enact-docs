// Utilities for working with types.  Primary use is in rendering types
// as part of /wrappers/json.js

import Type from '../components/Type';
import React from 'react';

export const renderType = (type, index) => {
	return <Type key={index}>{type}</Type>;
};

// This somewhat complex expression allows us to separate out the UnionType members from the
// regular ones and combine TypeApplications (i.e. Arrays of type) into a single unit instead
// of having String[] render as ['String', 'Array'].  Then, it looks for 'NullLiteral' or
// 'AllLiteral' and replaces them with the word 'null' or 'Any'. If any 'StringLiteralType'
// exist, add them with quotes around the value. A 'RecordType' is replaced with 'Object'.
// TODO: Add NumberLiteralType?
// TODO: Make NullableType more useful/interesting?
// NOTE: This is shared with a few parsers that have slightly
// different selectors
export const jsonataTypeParser = `
	$IsRootNullable := type = "NullableType";
	$quote := function($val) { "'" & $val & "'" };
	$GetNameExp := function($type) {
		[
			$type[type="AllLiteral"] ? ['Any'],
			$type[type="ArrayType"] ? ['Array'],
			$type[type="BooleanLiteralType"].value.$string(),
			$type[type="NameExpression"].name,
			$map($type[type="NullableType"].expression, $GetNameExp),
			$type[type="NullLiteral"] ? ['null'],
			$type[type="RecordType"] ? ['Object'],
			$map($type[type="StringLiteralType"].value, $quote),
			$type[type="UndefinedLiteral"] ? ['undefined']
		]
	};
	$GetType := function($type) { $type[type="TypeApplication"] ? $type[type="TypeApplication"].(expression.name & " of " & $GetNameExp(applications)[0]) : $type[type="OptionalType"] ? $GetAllTypes($type.expression) : $type[type="RestType"] ? $GetAllTypes($type.expression)};
	$GetAllTypes := function($elems) { $append($GetType($elems), $GetNameExp($elems))};
	$CheckUnionTypes := function($elem) { $elem.type = "UnionType" ? $GetAllTypes($elem.elements) : $GetAllTypes($elem) };
	$IsRootNullable ? $CheckUnionTypes($.expression) : $CheckUnionTypes($);
`;

export default renderType;
