
// // uncoment after connection firebase
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {Eye, EyeOff, Check } from 'lucide-react';
// import { SignUpSchema, SignUpFormValues } from '../../lib/zod-schemas';
// import { db, authRegister } from '../lib/firebase';

// const GROWBOX_GREEN = 'bg-[#4CAF50]';
// const GROWBOX_HOVER_GREEN = 'hover:bg-[#45A049]';
// // change to real icon
// const PlantIcon: React.FC = () => (
//   <div className="flex justify-center mb-8">
//     <div className="text-[#4CAF50] w-12 h-12">🌱</div>
//   </div>
// );

// interface InputFieldProps {
//   id: keyof SignUpFormValues;
//   label: string;
//   type: string;
//   placeholder: string;
//   register: ReturnType<typeof useForm<SignUpFormValues>>['register'];
//   error: any;
// }

// const PasswordInput: React.FC<InputFieldProps> = ({
//   id,
//   label,
//   register,
//   error,
//   placeholder,
// }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   const inputClasses = `
//         w-full p-3 border-b-2
//         ${error ? 'border-red-500' : 'border-gray-300'}
//         focus:border-[#4CAF50] focus:outline-none
//         text-base text-black pr-10
//     `;

//   return (
//     <div>
//       <label htmlFor={id} className="block text-sm font-medium text-black mb-1">
//         {label}
//       </label>
//       <div className="relative">
//         <input
//           id={id}
//           type={showPassword ? 'text' : 'password'}
//           placeholder={placeholder}
//           className={inputClasses}
//           {...register(id)}
//         />
//         <button
//           type="button"
//           onClick={togglePasswordVisibility}
//           className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
//         >
//           {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//         </button>
//       </div>
//       {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
//     </div>
//   );
// };

// const SignUpForm: React.FC = () => {
//   const [submissionError, setSubmissionError] = useState<string | null>(null);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting, isValid },
//     reset,
//   } = useForm<SignUpFormValues>({
//     resolver: zodResolver(SignUpSchema),
//     mode: 'onTouched',
//     defaultValues: {
//       email: '',
//       password: '',
//       confirmPassword: '',
//     },
//   });

//   const onSubmit = async (data: SignUpFormValues) => {
//     setSubmissionError(null);
//     setIsSuccess(false);

//     try {
//       const userCredential = await authRegister({
//         email: data.email,
//         password: data.password,
//         confirmPassword: data.confirmPassword,
//       });

//       const userId = userCredential.user.uid;
//       const { password, confirmPassword, ...userDataToSave } = data;

//       await db
//         .collection('users')
//         .doc(userId)
//         .set({
//           ...userDataToSave,
//           createdAt: new Date().toISOString(),
//         });

//       console.log('Реєстрація та збереження в Firestore успішні!');
//       setIsSuccess(true);
//       reset();
//     } catch (error) {
//       console.error('Помилка реєстрації:', error);
//       setSubmissionError(
//         'Помилка реєстрації. Перевірте дані або спробуйте пізніше.'
//       );
//     }
//   };

//   if (isSuccess) {
//     return (
//       <div className="text-[#4CAF50] font-bold text-center p-8">
//         🎉 Реєстрація успішна!
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white flex flex-col items-center pt-10">
//       <PlantIcon />

//       <h1 className="text-3xl font-bold text-black mt-4">Create an account</h1>
//       <p className="text-gray-500 mb-8">
//         Create an account to start growing plants
//       </p>

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full max-w-xs space-y-6 px-4"
//       >
//         {submissionError && (
//           <p className="text-sm text-red-600 font-medium bg-red-100 p-2 rounded">
//             {submissionError}
//           </p>
//         )}

//         <div>
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-black mb-1"
//           >
//             Email
//           </label>
//           <div className="relative">
//             <input
//               id="email"
//               type="email"
//               placeholder="nick.name@mail.com"
//               className={`w-full p-3 border-b-2
//                                 ${errors.email ? 'border-red-500' : 'border-gray-300'}
//                                 focus:border-[#4CAF50] focus:outline-none
//                                 text-base text-black pr-10`}
//               {...register('email')}
//             />
//             {isValid && !errors.email && (
//               <Check
//                 size={20}
//                 className="absolute inset-y-0 right-0 mt-3 mr-3 text-[#4CAF50]"
//               />
//             )}
//           </div>
//           {errors.email && (
//             <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
//           )}
//         </div>

//         <PasswordInput
//           id="password"
//           label="Password"
//           type="password"
//           placeholder="••••••••"
//           register={register}
//           error={errors.password}
//         />

//         <PasswordInput
//           id="confirmPassword"
//           label="Confirm Password"
//           type="password"
//           placeholder="••••••••"
//           register={register}
//           error={errors.confirmPassword}
//         />

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className={`
//                         w-full py-4 rounded-xl shadow-lg
//                         text-lg font-bold text-white mt-10
//                         ${
//                           isSubmitting
//                             ? 'bg-gray-400'
//                             : `${GROWBOX_GREEN} ${GROWBOX_HOVER_GREEN}`
//                         }
//                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50]
//                     `}
//         >
//           {isSubmitting ? 'Signing up...' : 'Sign up'}
//         </button>

//         <p className="text-center text-gray-500 pt-4">
//           Already have an account?
//           <a href="/login" className="text-black font-semibold ml-1">
//             Log in
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default SignUpForm;
