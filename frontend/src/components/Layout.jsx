/**
 * Created by anton on 08.02.17.
 */
"use strict";
import React from 'react';
function doNothing() {
}

const DivClass = ({children, className, style, specialClass, refProp, onClick}) => <div
    className={className ? className + " " + specialClass : specialClass}
    style={style ? style : {}}
    ref={refProp ? refProp : doNothing}
    onClick={onClick}
>{children}</div>;
export const DivFlexColumn = ({children, className, style, refProp, onClick}) => <DivClass className={className}
                                                                                           style={style}
                                                                                           specialClass="flex_column"
                                                                                           refProp={refProp}
                                                                                           onClick={onClick}
>
    {children}
</DivClass>;
export const DivFlexRow = ({children, className, style, refProp, onClick}) => <DivClass className={className}
                                                                                        style={style}
                                                                                        specialClass="flex_row"
                                                                                        refProp={refProp}
                                                                                        onClick={onClick}
>{children}</DivClass>;
export const DivFill = ({children, className, style, refProp, onClick}) => <DivClass className={className} style={style}
                                                                                     specialClass="fill_abs"
                                                                                     refProp={refProp}
                                                                                     onClick={onClick}
>{children}</DivClass>;
export const DivFlexStretch = ({children, className, style, refProp, onClick}) => <DivClass className={className}
                                                                                            style={style}
                                                                                            specialClass="flex_stretch"
                                                                                            refProp={refProp}
                                                                                            onClick={onClick}
>{children}</DivClass>;
export const DivFlexStretchFill = ({children, className, style, refProp, onClick}) => <DivFlexStretch
    className={className}
    style={style}
    refProp={refProp}
    onClick={onClick}
>
    <DivFill>{children}</DivFill>
</DivFlexStretch>;
export const DivFlexFixed = ({children, className, style, refProp, onClick}) => <DivClass className={className}
                                                                                          style={style}
                                                                                          specialClass="flex_fixed"
                                                                                          refProp={refProp}
                                                                                          onClick={onClick}
>{children}</DivClass>;
export const DivPaddingFill = ({children, className, style, refProp, onClick}) => <DivClass className={className}
                                                                                            style={style}
                                                                                            specialClass="padding fill_abs"
                                                                                            refProp={refProp}
                                                                                            onClick={onClick}
>{children}</DivClass>;
