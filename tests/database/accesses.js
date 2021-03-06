// There's a bug between eslint and prettier with spacing around async arrow
// functions, so we need to explicitly use async functions instead.
/* eslint-disable prefer-arrow-callback */

import should from 'should';

import { AccessFields, Accesses } from '../../server/models';

describe('Accesses model API', () => {
    let accessWithoutFields = {
        login: 'login',
        password: 'password',
        vendorId: 'gnagnagna'
    };

    let USER_ID = null;
    before(() => {
        // applyConfig must have already been called.
        USER_ID = process.kresus.user.id;
    });

    describe('Access creation', () => {
        before(async function() {
            await Accesses.destroyAll(USER_ID);
            await AccessFields.destroyAll(USER_ID);
        });

        let allAccesses, allFields;

        it('The access should be in the database', async function() {
            await Accesses.create(USER_ID, accessWithoutFields);
            allAccesses = await Accesses.all(USER_ID);
            allFields = await AccessFields.all(USER_ID);

            should.equal(allAccesses.length, 1);
            allAccesses.should.containDeep([accessWithoutFields]);

            should.equal(allFields.length, 0);
        });

        let fields = [{ name: 'name', value: 'toto' }, { name: 'website', value: 'other' }];
        let accessWithFields = { ...accessWithoutFields, fields };

        it('The access and the fields should be in the database', async function() {
            let accessWithoutFieldsId = (await Accesses.create(USER_ID, accessWithFields)).id;

            allAccesses = await Accesses.all(USER_ID);
            allFields = await AccessFields.all(USER_ID);

            should.equal(allAccesses.length, 2);
            allAccesses.should.containDeep([accessWithFields, accessWithoutFields]);

            should.equal(allFields.length, 2);
            allFields.should.containDeep(fields);
            for (let field of allFields) {
                should.equal(field.accessId, accessWithoutFieldsId);
            }
        });
    });

    describe('Access deletion', () => {
        before(async function() {
            await Accesses.destroyAll(USER_ID);
            await AccessFields.destroyAll(USER_ID);
        });

        let fields = [{ name: 'name', value: 'toto' }, { name: 'website', value: 'other' }];
        let accessWithFields = { ...accessWithoutFields, fields };

        let allAccesses, allFields, accessWithFieldsId;

        it('The access should be in the database', async function() {
            await Accesses.create(USER_ID, accessWithoutFields);
            accessWithFieldsId = (await Accesses.create(USER_ID, accessWithFields)).id;
            allAccesses = await Accesses.all(USER_ID);
            allFields = await AccessFields.all(USER_ID);

            should.equal(allAccesses.length, 2);
            allAccesses.should.containDeep([accessWithFields, accessWithoutFields]);

            should.equal(allFields.length, 2);
            allFields.should.containDeep(fields);
        });

        it('The access should be deleted', async function() {
            await Accesses.destroy(USER_ID, accessWithFieldsId);

            allFields = await AccessFields.all(USER_ID);
            should.equal(allFields.length, 0);

            allAccesses = await Accesses.all(USER_ID);
            should.equal(allAccesses.length, 1);
        });
    });
});
