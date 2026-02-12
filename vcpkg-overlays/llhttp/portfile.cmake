vcpkg_check_linkage(ONLY_STATIC_LIBRARY)

vcpkg_from_github(
    OUT_SOURCE_PATH SOURCE_PATH
    REPO nodejs/llhttp
    REF refs/tags/release/v${VERSION}
    SHA512 6f659bbdc4e7efc431a506a1889d074cbde0c47dc5daca735f3ac4a31d670f62d29882575cabace832c9523c0dcf93192f8810b05f42ed00bd828bf709feee15
    PATCHES
        fix-usage.patch
)
string(COMPARE EQUAL "${VCPKG_LIBRARY_LINKAGE}" "static" LLHTTP_BUILD_STATIC)
string(COMPARE EQUAL "${VCPKG_LIBRARY_LINKAGE}" "dynamic" LLHTTP_BUILD_SHARED)

vcpkg_cmake_configure(
    SOURCE_PATH "${SOURCE_PATH}"
    DISABLE_PARALLEL_CONFIGURE
    OPTIONS
        -DBUILD_SHARED_LIBS=${LLHTTP_BUILD_SHARED}
        -DBUILD_STATIC_LIBS=${LLHTTP_BUILD_STATIC}
)

vcpkg_cmake_install()
vcpkg_copy_pdbs()

vcpkg_cmake_config_fixup(
    CONFIG_PATH "/lib/cmake/${PORT}"
)
file(REMOVE_RECURSE "${CURRENT_PACKAGES_DIR}/debug/include")
vcpkg_install_copyright(FILE_LIST "${SOURCE_PATH}/LICENSE-MIT")

vcpkg_fixup_pkgconfig()
