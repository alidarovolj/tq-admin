<script setup>
import {useUsersStore} from "@/stores/users.js";
import {ref} from "vue";
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {
  Bars3Icon,
  CircleStackIcon,
  EnvelopeIcon,
  FolderIcon,
  HomeIcon,
  NewspaperIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import {RouterLink, useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import Footer from "@/components/Footer.vue";

const route = useRoute()

const navigation = [
  {name: 'Пользователи', href: '/users', icon: UsersIcon, alias: 'Users', children: []},
  {name: 'Продукты', href: '/products', icon: FolderIcon, alias: 'Products', children: []},
  {name: 'Заказы', href: '/orders', icon: CircleStackIcon, alias: 'Orders', children: []},
  {name: 'Обращения', href: '/messages', icon: EnvelopeIcon, alias: 'Messages', children: []},
  {name: 'Новости', href: '/news', icon: NewspaperIcon, alias: 'News', children: []},
]

const sidebarOpen = ref(false)

const users = useUsersStore()
const {userProfile} = storeToRefs(users)
</script>

<template>
  <div>
    <TransitionRoot
        :show="sidebarOpen"
        as="template">
      <Dialog
          class="relative z-50 lg:hidden"
          @close="sidebarOpen = false">
        <TransitionChild
            as="template"
            enter="transition-opacity ease-linear duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leave-from="opacity-100"
            leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80"/>
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
              as="template"
              enter="transition ease-in-out duration-300 transform"
              enter-from="-translate-x-full"
              enter-to="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leave-from="translate-x-0"
              leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                  as="template"
                  enter="ease-in-out duration-300"
                  enter-from="opacity-0"
                  enter-to="opacity-100"
                  leave="ease-in-out duration-300"
                  leave-from="opacity-100"
                  leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                      class="-m-2.5 p-2.5"
                      type="button"
                      @click="sidebarOpen = false">
                    <span class="sr-only">
                      Close sidebar
                    </span>
                    <XMarkIcon
                        aria-hidden="true"
                        class="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div class="flex h-16 shrink-0 items-center">
                  <img
                      alt="Your Company"
                      class="h-8 w-auto"
                      src="@/assets/img/logos/main.png"
                  />
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul
                      class="flex flex-1 flex-col gap-y-7"
                      role="list">
                    <li>
                      <ul
                          class="-mx-2 space-y-1"
                          role="list">
                        <li
                            v-for="item in navigation"
                            :key="item.name">
                          <RouterLink
                              :class="[route.name === item.alias ? 'bg-gray-50 text-mainColor' : 'text-gray-700 hover:bg-gray-50 hover:text-mainColor', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                              :to="item.href">
                            <component
                                :is="item.icon"
                                :class="[route.name === item.alias ? 'text-mainColor' : 'text-gray-400 group-hover:text-mainColor', 'h-6 w-6 shrink-0']"
                                aria-hidden="true"
                            />
                            {{ item.name }}
                          </RouterLink>
                          <div
                              v-if="item.children.length > 0"
                              class="pl-4">
                            <RouterLink
                                v-for="(child, ind) in item.children"
                                :key="ind"
                                :class="[route.name === child.alias ? 'bg-gray-50 text-mainColor' : 'text-gray-700 hover:bg-gray-50 hover:text-mainColor', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                :to="child.href">
                              <component
                                  :is="child.icon"
                                  :class="[route.name === child.alias ? 'text-mainColor' : 'text-gray-400 group-hover:text-mainColor', 'h-6 w-6 shrink-0']"
                                  aria-hidden="true"
                              />
                              {{ child.name }}
                            </RouterLink>
                          </div>
                        </li>
                      </ul>
                    </li>
                    <!--                    <li>-->
                    <!--                      <div class="text-xs font-semibold leading-6 text-gray-400">-->
                    <!--                        Доп. данные-->
                    <!--                      </div>-->
                    <!--                      <ul-->
                    <!--                          role="list"-->
                    <!--                          class="-mx-2 mt-2 space-y-1">-->
                    <!--                        <li-->
                    <!--                            v-for="team in teams"-->
                    <!--                            :key="team.name">-->
                    <!--                          <a-->
                    <!--                              :href="team.href"-->
                    <!--                              :class="[route.name === team.alias ? 'bg-gray-50 text-mainColor' : 'text-gray-700 hover:bg-gray-50 hover:text-mainColor', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">-->
                    <!--                            <span-->
                    <!--                                :class="[route.name === team.alias ? 'border-mainColor text-mainColor' : 'border-gray-200 text-gray-400 group-hover:border-mainColor group-hover:text-mainColor', 'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium']">-->
                    <!--                              {{ team.initial }}</span>-->
                    <!--                            <span class="truncate">-->
                    <!--                              {{ team.name }}-->
                    <!--                            </span>-->
                    <!--                          </a>-->
                    <!--                        </li>-->
                    <!--                      </ul>-->
                    <!--                    </li>-->
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <div class="flex h-16 shrink-0 items-center">
          <img
              alt="Your Company"
              class="h-8 w-auto"
              src="@/assets/img/logos/main.png"
          />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul
              class="flex flex-1 flex-col gap-y-7"
              role="list">
            <li>
              <ul
                  class="-mx-2 space-y-1"
                  role="list">
                <li
                    v-for="item in navigation"
                    :key="item.name">
                  <RouterLink
                      :class="[route.name === item.alias ? 'bg-gray-50 text-mainColor' : 'text-gray-700 hover:bg-gray-50 hover:text-mainColor', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                      :to="item.href">
                    <component
                        :is="item.icon"
                        :class="[route.name === item.alias ? 'text-mainColor' : 'text-gray-400 group-hover:text-mainColor', 'h-6 w-6 shrink-0']"
                        aria-hidden="true"/>
                    {{ item.name }}
                  </RouterLink>
                  <div
                      v-if="item.children.length > 0"
                      class="pl-4">
                    <RouterLink
                        v-for="(child, ind) in item.children"
                        :key="ind"
                        :class="[route.name === child.alias ? 'bg-gray-50 text-mainColor' : 'text-gray-700 hover:bg-gray-50 hover:text-mainColor', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                        :to="child.href">
                      <component
                          :is="child.icon"
                          :class="[route.name === child.alias ? 'text-mainColor' : 'text-gray-400 group-hover:text-mainColor', 'h-6 w-6 shrink-0']"
                          aria-hidden="true"
                      />
                      {{ child.name }}
                    </RouterLink>
                  </div>
                </li>
              </ul>
            </li>
            <!--            <li>-->
            <!--              <div class="text-xs font-semibold leading-6 text-gray-400">-->
            <!--                Доп. данные-->
            <!--              </div>-->
            <!--              <ul-->
            <!--                  role="list"-->
            <!--                  class="-mx-2 mt-2 space-y-1">-->
            <!--                <li-->
            <!--                    v-for="team in teams"-->
            <!--                    :key="team.name">-->
            <!--                  <a-->
            <!--                      :href="team.href"-->
            <!--                      :class="[route.name === team.alias ? 'bg-gray-50 text-mainColor' : 'text-gray-700 hover:bg-gray-50 hover:text-mainColor', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">-->
            <!--                    <span-->
            <!--                        :class="[route.name === team.alias ? 'border-mainColor text-mainColor' : 'border-gray-200 text-gray-400 group-hover:border-mainColor group-hover:text-mainColor', 'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium']">-->
            <!--                      {{ team.initial }}</span>-->
            <!--                    <span class="truncate">-->
            <!--                      {{ team.name }}-->
            <!--                    </span>-->
            <!--                  </a>-->
            <!--                </li>-->
            <!--              </ul>-->
            <!--            </li>-->
            <li
                v-if="userProfile"
                class="-mx-6 mt-auto">
              <a
                  class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                  href="#">
                <img
                    alt=""
                    class="h-8 w-8 rounded-full bg-gray-50"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"/>
                <span class="sr-only">
                  Your profile
                </span>
                <span aria-hidden="true">
                  {{ userProfile.email }}
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button
          class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          type="button"
          @click="sidebarOpen = true">
        <span class="sr-only">
          Open sidebar
        </span>
        <Bars3Icon
            aria-hidden="true"
            class="h-6 w-6"
        />
      </button>
      <div class="flex-1 text-sm font-semibold leading-6 text-gray-900">
        Dashboard
      </div>
      <a href="#">
        <span class="sr-only">
          Your profile
        </span>
        <img
            alt=""
            class="h-8 w-8 rounded-full bg-gray-50"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        />
      </a>
    </div>

    <main class="lg:pl-72 pt-10">
      <div>
        <div>
          <slot/>
        </div>
      </div>
      <Footer/>
    </main>
  </div>
</template>