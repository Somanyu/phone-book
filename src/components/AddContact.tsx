import { Input, Button, FormLabel, FormErrorMessage, Heading, Spacer, IconButton, Grid, HStack, GridItem, FormControl, Center, Card, CardBody, Flex, VStack, SimpleGrid } from '@chakra-ui/react'
import { GoPersonAdd, GoX, GoTriangleLeft, GoCheck, GoPlus } from "react-icons/go";
import PhoneInput from 'react-phone-input-2';
import { Field, Form, Formik, FieldArray } from 'formik';

import 'react-phone-input-2/lib/style.css';
import { Link } from 'react-router-dom';

type Props = {}

const AddContact = (props: Props) => {

    const validateFirstName = (value: string) => {
        let error: string | undefined;

        if (!value) {
            error = 'First name is required';
        } else if (!/^[A-Za-z]+$/.test(value)) {
            error = 'Only letters are allowed';
        } else if (value.length < 3 || value.length > 20) {
            error = 'First name must be between 3 and 20 characters';
        }
        return error;
    };

    const validateLastName = (value: string) => {
        let error: string | undefined;

        if (!value) {
            error = 'Last name is required';
        } else if (!/^[A-Za-z]+$/.test(value)) {
            error = 'Only letters are allowed';
        } else if (value.length < 3 || value.length > 20) {
            error = 'Last name must be between 3 and 20 characters';
        }
        return error;
    };

    const validatePhone = (value: string) => {
        let error: string | undefined;

        if (!value) {
            error = 'Phone number is required';
        } else if (!/^[0-9]+$/.test(value)) {
            error = 'Only letters are allowed';
        } else if (value.length < 7 || value.length > 20) {
            error = 'Number must be between 7 and 20 digits';
        }
        return error;
    };

    return (
        <div>
            <Heading mb={10} mt={10} textAlign={'center'}><IconButton variant={'outline'} aria-label='Add contact' icon={<GoPersonAdd />} /> Add Contact</Heading>
            <Center>
                <Card>
                    <CardBody>
                        <Formik
                            initialValues={{ first_name: '', last_name: '', phoneNumbers: [''] }}
                            onSubmit={(values) => {
                                // Handle form submission
                                console.log(values);
                            }}
                        >
                            {({ values, handleSubmit, setFieldValue }) => (
                                <Form>
                                    <Grid templateColumns='repeat(2, 1fr)' gap={4} mb={3}>
                                        <GridItem>
                                            <Field name='first_name' validate={validateFirstName}>
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.first_name && form.touched.first_name} isRequired>
                                                        <FormLabel>First name</FormLabel>
                                                        <Input {...field} placeholder='John' isRequired={true} />
                                                        <FormErrorMessage>{form.errors.first_name}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </GridItem>
                                        <GridItem>
                                            <Field name='last_name' validate={validateLastName}>
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.last_name && form.touched.last_name} isRequired>
                                                        <FormLabel>Last name</FormLabel>
                                                        <Input {...field} placeholder='John' isRequired={true} />
                                                        <FormErrorMessage>{form.errors.last_name}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </GridItem>
                                    </Grid>

                                    <Grid templateColumns='repeat(5, 1fr)' gap={4}>
                                        <FieldArray name="phoneNumbers">
                                            {({ push, remove }: any) => (
                                                <GridItem colSpan={3}>
                                                    <FormLabel>Phone number</FormLabel>
                                                    {values.phoneNumbers.map((phoneNumber: any, index: any) => (
                                                        <div key={index}>
                                                            <Field
                                                                name={`phoneNumbers.${index}`}
                                                                validate={validatePhone}
                                                            >
                                                                {({ field, form }: any) => (
                                                                    <FormControl
                                                                        isInvalid={
                                                                            form.errors.phoneNumbers?.[index] &&
                                                                            form.touched.phoneNumbers?.[index]
                                                                        }
                                                                        isRequired
                                                                    >
                                                                        <HStack>
                                                                            <PhoneInput
                                                                                {...field}
                                                                                country="in"
                                                                                placeholder="Enter phone number"
                                                                                countryCodeEditable={false}
                                                                                containerStyle={{ marginTop: '3.5px' }}
                                                                                onBlur={() => form.setFieldTouched(`phoneNumbers.${index}`, true)}
                                                                                onChange={(phoneNumber) =>
                                                                                    form.setFieldValue(`phoneNumbers.${index}`, phoneNumber)
                                                                                }
                                                                            />
                                                                            {index > 0 && (
                                                                                <IconButton
                                                                                    colorScheme="red"
                                                                                    aria-label='Remove number'
                                                                                    icon={<GoX />}
                                                                                    size="xs"
                                                                                    onClick={() => remove(index)}
                                                                                />
                                                                            )}
                                                                        </HStack>
                                                                        <FormErrorMessage>
                                                                            {form.errors.phoneNumbers?.[index]}
                                                                        </FormErrorMessage>
                                                                    </FormControl>
                                                                )}
                                                            </Field>

                                                        </div>
                                                    ))}
                                                    <Button
                                                        mt={3}
                                                        leftIcon={<GoPlus />}
                                                        colorScheme="green"
                                                        size="xs"
                                                        onClick={() => push('')}
                                                    >
                                                        Add another number
                                                    </Button>
                                                </GridItem>
                                            )}
                                        </FieldArray>

                                    </Grid>
                                    <Flex mt={10}>
                                        <Link to='/'>
                                            <Button leftIcon={<GoTriangleLeft />} colorScheme='red' variant='ghost'>
                                                Contact list
                                            </Button>
                                        </Link>
                                        <Spacer />
                                        <Button leftIcon={<GoCheck />} type='submit' colorScheme='whatsapp' >
                                            Save
                                        </Button>
                                    </Flex>
                                </Form>
                            )}
                        </Formik>
                    </CardBody>
                </Card>
            </Center>
        </div>
    )
}

export default AddContact